
module.exports = (req, res, next) => {

    const { password, confirmPassword } = req.body;
    if (password === undefined || confirmPassword === undefined) {
        return res.status(400).send({ error: error[1] })
    }
    if (password !== confirmPassword) {

        return res.status(400).send({ error: error[0] })
    }
    next();
}


const error = [{
    password: {
        name: "validation error",
        message: "Password doesn't match"
    },
    message: "Password doesn't match",
    name: "ValidationError"
},
{
    password: {
        name: "validation error",
        message: "Password field not Present"
    },
    message: "Password field not Present",
    name: "ValidationError"
}]