const { validationResult } = require("express-validator");
const Student = require("../../models/studentSchema");

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getAllStudents = (request, response) => {

    if (request.role == "administrator" || request.role == "speaker") {
        Student.find({})
            .then(data => {
                response.status(200).json(data)
            })
            .catch(error => {
                next(error);
            })

    }
    else {
        throw new Error("Not Authorized. A student can't do that");
    }
}

exports.getStudent = (request, response) => {
    if (request.role == "administrator" || request.role == "speaker") {
        Student.find({ _id: request.params.id })
            .then(data => {
                response.status(200).json(data)
            })
            .catch(error => {
                next(error);
            })
    }
    else {
        throw new Error("Not Authorized. A student can't do that");
    }


}

exports.addStudent = (request, response, next) => {

    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }


    if (request.role == "administrator" || request.role == "student") {

        const hash = bcrypt.hashSync(request.body.password, 10);

        let studentObj = new Student({
            _id: request.body.id,
            fullname: request.body.fullname,
            password: hash,
            email: request.body.email,
        })
        studentObj.save()
            .then(data => {
                response.status(201).json({ message: "added", data })
            })
            .catch(error => next(error))

    }
    else {

        throw new Error("Not Authorized.");
    }

}

exports.updateStudent = (request, response, next) => {

    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;
    }

    if (request.role == "administrator" || request.role == "student") {
        Student.findByIdAndUpdate(request.body.id, {
            $set: {
                // _id: request.body.id,
                fullname: request.body.fullname,
                password: request.body.password,
                email: request.body.email,
            }
        })
            .then(data => {
                if (data == null) throw new Error("Student not found");
                response.status(200).json({ message: "Updated", data })
            })
            .catch(error => next(error))
    }
    else {
        throw new Error("Not Authorized.");
    }



}


exports.deleteStudent = (request, response, next) => {

    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        let error = new Error();
        error.status = 422;
        error.message = errors.array().reduce((current, object) => current + object.msg + " ", "")
        throw error;

    }

    if (request.role == "administrator") {
        Student.findByIdAndDelete(request.body.id)
            .then(data => {
                if (data == null) throw new Error("student Is not Found!")
                response.status(200).json({ message: "deleted" })
            })
            .catch(error => next(error))
    }
    else {
        throw new Error("Not Authorized. Only admin can do that");
    }


}
