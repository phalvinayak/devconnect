const Validator = require('validator');
const {isEmpty} = require("./util")

module.exports = validateCommentInput = data => {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : "";

    if(!Validator.isLength(data.text, {min: 10, max: 300})){
        errors.text = 'Comment must be between 10 to 300 characters';
    }

    if(Validator.isEmpty(data.text)){
        errors.text = 'Text field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}