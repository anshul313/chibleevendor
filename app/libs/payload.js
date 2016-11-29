// var requied = {
// 	"link":['image','link'],
// 	"share-action":['shareMessage']
// }


var arnType = {
	"dataProcessed": {
		"action": "dataProcessed",
		"heading": '',
		"data": '',
		"alert": ''
	}
}

var getPayload = function(activity, os) {
	arnType[activity.action].heading = activity.heading;
	arnType[activity.action].data = activity.data;

	arnType[activity.action].alert = arnType[activity.action].message = activity.heading + ' ' + activity.data;

	if (activity.image)
		arnType[activity.action].image = activity.image

	if (activity.link)
		arnType[activity.action].link = activity.link

	if (activity.shareMessage)
		arnType[activity.action].shareMessage = activity.shareMessage

	if (os === 'Android')
		delete arnType[activity.action].alert;
	if (os === 'iOS')
		delete arnType[activity.action].message;


	return arnType[activity.action];
};

module.exports = {
	exec: getPayload
		// requied:requied
};