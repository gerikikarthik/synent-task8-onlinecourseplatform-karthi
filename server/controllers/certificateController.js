const Certificate = require("../models/Certificate");

exports.generateCertificate = async (req, res) => {

    const userId = req.user.id;
    const courseId = req.params.id;

    let certificate = await Certificate.findOne({
        user: userId,
        course: courseId,
    });

    if (certificate) {
        return res.json(certificate);
    }

    const certificateId =
        "CH-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000);

    certificate = await Certificate.create({
        user: userId,
        course: courseId,
        certificateId,
    });

    res.json(certificate);
};