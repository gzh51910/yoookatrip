const {
    MongoClient,
    ObjectId
} = require('mongodb');

//引入文件模块
const {
    mongodbUrl,
    dbName
} = require('../config.json');

//连接mongoDB数据库
async function connect() {
    const client = await MongoClient.connect(mongodbUrl, {
        useUnifiedTopology: true
    });
    // 连接数据库，无则自动创建
    const db = client.db(dbName);
    return {
        client,
        db
    }
}
/**
 * 增加
 * @param  {String}          colName        集合名称
 * @param  {Array|Object}    data           插入的数据
 * @return {Object}                         返回写入的结果
 */

async function create(colName, data) {
    const {
        client,
        db
    } = await connect();
    //获取集合
    let collection = db.collection(colName);
    //判断传入的data是否为数组
    if (!Array.isArray(data)) {
        data = [data]
    }
    //把数据插入数据库
    let result = await collection.insertOne(data);
    //在操作完成后，需要关闭数据库连接，释放资源占用
    client.close();

    return result;
}
/**
 * 删除
 * @param {String} colName      集合名称
 * @param {Object} query        查询条件
 */

async function remove(colName, query) {
    const {
        client,
        db
    } = await connect();
    //获取集合
    let collection = db.collection(colName);
    //格式化，传入的必须是字符串切符合mongodb数据库的格式
    if (query._id && typeof query._id === 'string') {
        query._id = ObjectId(query._id)
    }

    let result = await collection.deleteMany(query);

    client.close();

    return result
}
/**
 * 更新
 * @param {String} colName      集合名称
 * @param {Object} query        查询条件
 * @param {Object} data         更新字段数据
 */
async function update(colName, query, data) {
    const {
        db,
        client
    } = await connect();

    let collection = db.collection(colName);

    if (query._id && typeof query._id === 'string') {
        query._id = ObjectId(query._id)
    }

    let result = await collection.updateMany(query, {
        $set: data
    });
    client.close();
    return result;
}
/**
 * 查询
 * @param {String}  colName         集合名称
 * @param {Object}  query           查询条件
 */
async function find(colName, query = {}, options = {}) {
    // fields：用于过滤某些字段
    let {
        fields,
        skip,
        limit,
        sort
    } = options;
    let {
        db,
        client
    } = await connect();
    //获取集合
    let collection = db.collection(colName);
    if (query._id && typeof query._id === 'string') {
        query._id = ObjectId(query._id)
    }
    //在数据库查找
    let result = await collection.find(query, {
        fields
    })

    // 跳过数量
    if (skip) {
        result = result.skip(skip)
    }

    // 限制数量
    if (limit) {
        result = result.limit(limit * 1)
    }

    // 排序
    // sort="qty"
    if (sort) {

        // 处理排序规则
        // sort="price" / sort="price,1"
        let arr = sort.split(',');
        let key = arr[0];
        let value = arr[1] ? arr[1] * 1 : -1

        // let obj = {}
        // obj[sort] = -1
        // ES6写法：在对象的键中使用变量
        result = result.sort({
            // [sort]:-1
            [key]: value
        })
    }


    result = result.toArray()

    //在操作完成后，需要关闭数据库连接，释放资源占用
    client.close();
    //return 结果出去
    return result;


}
module.exports = {
    create,
    remove,
    update,
    find
}