const Faq = require("../models/Faq");

exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const newFaq = new Faq(req.body);
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
