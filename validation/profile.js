const Validator = require('validator');
const {isEmpty} = require("../validation/util")

module.exports = validateProfileInput = data => {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : "";
    data.status = !isEmpty(data.status) ? data.status : "";
    data.skills = !isEmpty(data.skills) ? data.skills : "";

    if(!Validator.isLength(data.handle, {min: 4, max: 40})){
        errors.handle = 'Handle must be between 4 to 40 characters';
    }

    if(Validator.isEmpty(data.handle)){
        errors.handle = 'Handle field is required';
    }

    if(!isEmpty(data.website) && !Validator.isURL(data.website)){
        errors.website = 'Invalid website URL';
    }

    if(Validator.isEmpty(data.status)){
        errors.status = 'Status field is required';
    }

    if(Validator.isEmpty(data.skills)){
        errors.skills = 'Skills field is required';
    }

    if(!isEmpty(data.youtube) && !Validator.isURL(data.youtube)){
        errors.youtube = 'Invalid youtube URL';
    }

    if(!isEmpty(data.twitter) && !Validator.isURL(data.twitter)){
        errors.twitter = 'Invalid twitter URL';
    }

    if(!isEmpty(data.facebook) && !Validator.isURL(data.facebook)){
        errors.facebook = 'Invalid facebook URL';
    }

    if(!isEmpty(data.instagram) && !Validator.isURL(data.instagram)){
        errors.instagram = 'Invalid instagram URL';
    }

    if(!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)){
        errors.linkedin = 'Invalid linkedin URL';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}