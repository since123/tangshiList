'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const data =  {
		title: 'k',
		text: 's',
		author:'m'
	}
	await db.collection('tangshi').add(data)
	//返回数据给客户端
	return {
		code: 200,
		msg: '添加成功'
	}
};
