import {Sequelize,DataTypes} from 'sequelize';
const sequelize = new Sequelize({
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: './data/db_key.sqlite'
});

const keydb = sequelize.define('key_st', {
  user_id: {
      type: DataTypes.INTEGER,
      unique: true
  },
  address: DataTypes.STRING,

  cipher_key: DataTypes.STRING
});

sequelize.sync().then(function() {
    return keydb.create({
        user_id: 0,
        address: 'address__',
        cipher_key: 'eigen__'
    });
}).then(function(row: any) {
    console.log(row.get({
        plain: true
    }));
    keydb.destroy({where:{address: row.address}})
}).catch(function (err) {
  console.log('Unable to connect to the database:', err);
});

const add = function(user_id, address, cipher_key) {
  return keydb.create({
      user_id,
      address,
      cipher_key
  })
};

const updateOrAdd = function(user_id, old_address, new_address, new_cipher_key){
    keydb.findOne({where: {user_id: user_id, address: old_address,
    }}).then(function(row: any){
        console.log(row)
        if (row === null) {
            add(user_id, new_address, new_cipher_key)
            return true
        }
        return row.update({
            user_id: user_id,
            address: new_address,
            cipher_key: new_cipher_key
        }).then(function(result){
            console.log("Update success: "+result);
            return true
        }).catch(function(err){
            console.log("Update error: "+err);
            return false
        });
    });
};

const getByUserID = function (user_id: string) {
  return keydb
    .findOne({ where: { user_id: user_id } })
    .then(function (row: any) {
      console.log(row)
      return row;
    });
};

export {updateOrAdd, add, getByUserID};
