exports.chatWithBot = (req, res) => {
  const { message } = req.body;

  let reply = "Sorry, I don't understand yet.";

  const q = message.toLowerCase();

  if (q.includes("hello") || q.includes("hi"))
    reply = "Hello! I'm Campus Buddy 🤖";

  else if (q.includes("exam"))
    reply = "You can find exam schedules in the announcements section.";

  else if (q.includes("library"))
    reply = "The library is open from 9 AM to 8 PM.";

  else if (q.includes("club"))
    reply = "Clubs post events regularly on Campus Buddy.";

  res.json({ reply });
};
