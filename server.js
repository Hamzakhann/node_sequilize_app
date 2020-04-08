const express = require("express")
const Sequelize = require("sequelize")
const _USERS = require("./users.json")
const Op = Sequelize.Op
const app = express()
const port = 8001

const connection = new Sequelize("db" , "user" , "pass" ,{
    host:'localhost',
    dialect:"sqlite",
    storage:'db.sqlite',
    // operatorsAliases:fals,
    // define:{
    //     freezeTableName:true
    // }
})

// const User = connection.define("User" , {
//     uuid:{
//         type:Sequelize.UUID,
//         primaryKey:true,
//         defaultValue:Sequelize.UUIDV4
//     },
//     name :{
//         type:Sequelize.STRING,
//         validate:{
//             len:[3]
//         }
//     },
//     bio:{
//         type:Sequelize.TEXT,
//         validate:{
//             contain:{
//                 args:["foo"],
//                 msg:'Error : Field must contain foo'
//             }
//         }
//     }
// },{
//     timestamps:false
// });


// const User = connection.define("User" , {
//     uuid:{
//         type:Sequelize.UUID,
//         primaryKey:true,
//         defaultValue:Sequelize.UUIDV4
//     },
//     first:Sequelize.STRING,
//     last:Sequelize.STRING,
//     full_name:Sequelize.STRING,
//     bio:Sequelize.TEXT
// },{
//     hooks:{
//         beforeValidate : ()=>{
//             console.log("before validate")
//         },
//         afterValidate : ()=>{
//             console.log("After validate")
//         },
//         beforeCreate:(user)=>{
//             user.full_name = `${user.first} ${user.last}`
//             console.log("Before Create")
//         },
//         afterCreate:()=>{
//             console.log("After Create")
//         }
//     }
// });
const User = connection.define("User" , {
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        validate:{
            isEmail:true
        }
    },
    password:{
        type:Sequelize.STRING,
        validate:{
            isAlphanumeric:true
        }
    }
});
const Post = connection.define("Post" , {
    // id:{
    //     primaryKey:true,
    //     type:Sequelize.UUID,
    //     defaultValue:Sequelize.UUIDV4
    // },
    title:Sequelize.STRING,
    content:Sequelize.TEXT
});
const Comment = connection.define("Comment" , {
    the_comment:Sequelize.STRING
});




Post.belongsTo(User,{foreignKey:"userId"});
Post.hasMany(Comment,{as:'All_Comments'});

connection
.sync({
    logging:console.log,
    // force:true
}).then(()=>{
    // User.bulkCreate(_USERS)
    Post.create({
        UserId:1,
        title:"first post ",
        content : "Post content 1"
    })
    .then(posts=>console.log("Success created users"))
    .catch(err=>console.log(err))
})
.then(()=>console.log('database connected'))
.catch((e)=>console.log("some error database " ,e))

app.get('/allPost' , (req, res)=>{
    Post.findAll({
        include:[User]
    })
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})
app.get('/singlePost' , (req, res)=>{
    Post.findByPk('1',{
        include:[{
            model:Comment, as:"All_Comments",
            attributes:['the_comment']
        }]
    })
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})


// app.post('/post' , (req, res)=>{
//     User.create({
//         name:req.body.name,
//         email:req.body.email
//     })
//     .then(user=>{
//         res.json(user)
//     })
//     .catch(err=>{
//         res.status(400).send(err)
//     })
// })


// app.get('/findAll' , (req, res)=>{
//     User.findAll({where:{name:"Brody"}})
//     .then(user=>{
//         res.json(user)
//     })
//     .catch(err=>{
//         res.status(400).send(err)
//     })
// })
// app.get('/findAll' , (req, res)=>{
//     User.findAll({where:{name:{
//         [Op.like]:"Br%"
//     }}})
//     .then(user=>{
//         res.json(user)
//     })
//     .catch(err=>{
//         res.status(400).send(err)
//     })
// })

app.get('/findOne' , (req, res)=>{
    User.findByPk("55")
    .then(user=>{
        res.json(user)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})
app.put('/update' , (req, res)=>{
    User.update({
        name:"hamza",
        email:"hamzakhann66@gmail.com"
    },{
        where:{id:"55"}
    })
    .then(rows=>{
        res.json(rows)
    })
    .catch(err=>{
        res.status(400).send(err)
    })
})


// app.get('/' , (req, res)=>{
//     User.create({
//         name:"Hamza Khan", 
//         bio:"This is my bio"
//     })
//     .then(user=>{
//         res.json(user)
//     })
//     .catch(err=>{
//         res.status(400).send(err)
//     })
// })


app.listen(port,()=>{
    console.log("Server is running on port " , port)
})