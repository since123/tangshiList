'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('tangshi') // 获取tangshi的集合对象
	console.log('collection : ', collection)
	const res = await collection.limit(event.limit).skip(event.offset).where({
		title: new RegExp(event.keyWord)
	}).get()
	//返回数据给客户端
	return res
};
