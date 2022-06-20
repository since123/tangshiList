'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const id = event.id
	const collection = db.collection('tangshi')
	const res=collection.where({
		_id:id
	}).get()//返回数据给客户端
	return res
};
