function VigiglobeError (requestString, request, response, reason)
{
    this.name = "VigiglobeError";
    this.message = "Vigiglobe's API error for request : "+request +' - reason : '+reason;
    this.requestString = requestString;
    this.request = request;
    this.response = response;
    this.reason = reason;
}
VigiglobeError.prototype = Object.create (Error.prototype);
VigiglobeError.constructor = VigiglobeError;

exports = module.exports = VigiglobeError;