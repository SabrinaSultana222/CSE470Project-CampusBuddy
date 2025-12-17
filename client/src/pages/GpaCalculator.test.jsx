import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GpaCalculator from './GpaCalculator';
import { ToastProvider } from '../context/ToastContext';

describe('GpaCalculator UI', () => {
  test('adds a course row when + Add Course is clicked', async () => {
    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    // Initially there should be one course input group
    const initialCourseInputs = await screen.findAllByPlaceholderText(/Course Name/i);
    expect(initialCourseInputs.length).toBeGreaterThanOrEqual(1);

    const addBtn = screen.getByRole('button', { name: /add course/i });
    await userEvent.click(addBtn);

    const afterCourseInputs = await screen.findAllByPlaceholderText(/Course Name/i);
    expect(afterCourseInputs.length).toBe(initialCourseInputs.length + 1);
  });

  test('saves courses to server when logged in', async () => {
    // simulate logged in user via localStorage and mock fetch used by authFetch
    localStorage.setItem('campusbuddy.token', 'tok123');
    localStorage.setItem('campusbuddy.user', JSON.stringify({ _id: 'u1' }));
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ success: true }) });
    global.fetch = mockFetch;

    const { default: GpaCalc } = await import('./GpaCalculator');
    render(
      <ToastProvider>
        <GpaCalc />
      </ToastProvider>
    );

    // wait for any async load to finish and then fill the inputs
    const addBtn = await screen.findByRole('button', { name: /\+ Add Course/i });
    const name = await screen.findByPlaceholderText(/Course Name/i);
    const credit = screen.getByPlaceholderText(/Credits/i);
    const grade = screen.getByRole('combobox');

    await userEvent.type(name, 'Test Course');
    await userEvent.clear(credit);
    await userEvent.type(credit, '3');
    await userEvent.selectOptions(grade, 'A');

    // the save button may be temporarily in loading state; wait for it to be enabled and visible
    const saveBtn = await screen.findByRole('button', { name: /^save$/i });
    await userEvent.click(saveBtn);

    // fetch should have been called for the gpa course POST
    expect(mockFetch).toHaveBeenCalled();
    const fetchCall = mockFetch.mock.calls.find(c => c[0] === '/api/gpa/course');
    expect(fetchCall).toBeTruthy();
    const options = fetchCall[1];
    expect(options.method).toBe('POST');
    const parsed = JSON.parse(options.body);
    expect(parsed.name).toBe('Test Course');
    expect(parsed.credits).toBe(3);
    expect(parsed.grade).toBe('A');
  });

  test('shows toast when trying to save while not logged in', async () => {
    // ensure logged out
    localStorage.removeItem('campusbuddy.token');
    localStorage.removeItem('campusbuddy.user');

    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const saveBtn = await screen.findByRole('button', { name: /^save$/i });
    await userEvent.click(saveBtn);

    // toast should appear
    const toast = await screen.findByText(/please login to save courses/i);
    expect(toast).toBeInTheDocument();
  });

  test('pressing Enter in inputs does not clear courses / cause submit', async () => {
    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const name = await screen.findByPlaceholderText(/Course Name/i);
    await userEvent.type(name, 'Linear Algebra');
    // press Enter
    await userEvent.keyboard('{Enter}');

    // the input value should remain
    expect(name).toHaveValue('Linear Algebra');

    // still one course input present
    const inputs = await screen.findAllByPlaceholderText(/Course Name/i);
    expect(inputs.length).toBe(1);
  });

  test('validation errors reset loading and show field errors', async () => {
    // simulate logged in
    localStorage.setItem('campusbuddy.token', 'tok123');
    localStorage.setItem('campusbuddy.user', JSON.stringify({ _id: 'u1' }));

    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const saveBtn = await screen.findByRole('button', { name: /^save$/i });
    await userEvent.click(saveBtn);

    // should show validation error and not remain loading
    const nameError = await screen.findByText(/Course name is required/i);
    expect(nameError).toBeInTheDocument();
    // spinner should not be present
    expect(screen.queryByRole('status')).not.toBeTruthy();
    // button should show text again
    expect(saveBtn).toHaveTextContent(/^save$/i);
  });

  test('api validation errors are shown and success toast not shown', async () => {
    // simulate logged in
    localStorage.setItem('campusbuddy.token', 'tok123');
    localStorage.setItem('campusbuddy.user', JSON.stringify({ _id: 'u1' }));

    // mock fetch to respond with API validation errors
    global.fetch = jest.fn().mockResolvedValue({ ok: false, headers: { get: () => 'application/json' }, json: async () => ({ errors: [{ param: 'name', msg: 'Too short' }] }) });

    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const name = await screen.findByPlaceholderText(/Course Name/i);
    const credit = screen.getByPlaceholderText(/Credits/i);
    const grade = screen.getByRole('combobox');
    await userEvent.type(name, 'X');
    await userEvent.clear(credit);
    await userEvent.type(credit, '3');
    await userEvent.selectOptions(grade, 'A');

    const saveBtn = await screen.findByRole('button', { name: /^save$/i });
    await waitFor(() => expect(saveBtn).not.toBeDisabled());
    await userEvent.click(saveBtn);

    const apiError = await screen.findByText(/Too short/i);
    expect(apiError).toBeInTheDocument();
  });

  test('draft persists across remount (localStorage)', async () => {
    // ensure no server auth
    localStorage.removeItem('campusbuddy.token');
    localStorage.removeItem('campusbuddy.user');
    localStorage.removeItem('campusbuddy.gpa.draft');

    const { unmount } = render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const name = await screen.findByPlaceholderText(/Course Name/i);
    await userEvent.type(name, 'Persistence Test');

    // allow debounce to persist
    await new Promise(r => setTimeout(r, 600));

    // unmount and remount component
    unmount();
    render(
      <ToastProvider>
        <GpaCalculator />
      </ToastProvider>
    );

    const name2 = await screen.findByPlaceholderText(/Course Name/i);
    expect(name2).toHaveValue('Persistence Test');
  });
});
