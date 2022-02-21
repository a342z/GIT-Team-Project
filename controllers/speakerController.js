const { validationResult } = require("express-validator");
const Speaker = require("./../models/speakerSchema");
const bcrypt = require("bcrypt");

exports.getAllSpeaker = (request, response, next) => {
  if (request.role == "administrator" || request.role == "speaker") {
    Speaker.find({})
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("Not Authorized. A student can't do that");
  }
};

exports.getSpeaker = (request, response) => {
  if (request.role == "administrator" || request.role == "speaker") {
    Speaker.find({ email: request.params.email })
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("Not Authorized. A student can't do that");
  }
};

exports.addSpeaker = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  const hash = bcrypt.hashSync(request.body.password, 10);
  let speakerObj = new Speaker({
    // _id: request.body.id,
    fullname: request.body.fullname,
    password: hash,
    email: request.body.email,
    address: request.body.address,
    role: request.body.role,
    image: request.file.filename,
  });

  speakerObj
    .save()
    .then((data) => {
      response.status(201).json({ message: "added", data });
    })
    .catch((error) => next(error));
};

exports.updateSpeaker = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  Speaker.updateOne(
    { email: request.body.email },
    {
      $set: {
        // _id: request.body.id,
        fullname: request.body.fullname,
        password: request.body.password,
        email: request.body.email,
        address: request.body.address,
        role: request.body.role,
        // image: request.body.image
        image: request.file.filename,
      },
    }
  )
    .then((data) => {
      if (data == null) throw new Error("Speaker not found");
      response.status(200).json({ message: "Updated", data });
    })
    .catch((error) => next(error));
};

exports.deleteSpeaker = async (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  if (request.role == "administrator") {
    try {
      let data = await Speaker.findOneAndDelete({ email: request.body.email });
      if (data == null) throw new Error("Speaker not found");
      response.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  } else {
    next(new Error("Not Authorized. Only admin can do that"));
  }
};
