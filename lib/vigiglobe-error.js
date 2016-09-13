function VigiglobeError (response, reason)
{
    this.name = "VigiglobeError";
    this.message = "Vigiglobe's API error for request : "+response.request.href +' - reason : '+reason;
    this.requestString = response.request.href;
    this.request = response.request;
    this.response = response;
    this.reason = reason;
}
VigiglobeError.prototype = Object.create (Error.prototype);
VigiglobeError.constructor = VigiglobeError;

exports = module.exports = VigiglobeError;