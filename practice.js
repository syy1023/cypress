

describe("注册页面的用例，UI" ,() => {

//xxxxx注册和登录页面的Demo，暂时没分cases，所以部分步骤间都有依赖
//局限性是以下的project_name，regis_mailbox参数成功创建后下一次需要更改否则会报错

  var url_home='https://qa.xxxxxx.com/zh-CN/'
  var url_login='https://qa.xxxxxx.com/zh-CN/auth/login'
  var url_regis='https://qa.xxxxxx.com/zh-CN/auth/register'


  var project_name='cypresstest17'
  var project_tag='cypresstest17'

  var username='y1204xxxxx3.com'
  var password='1234ABcd..'

  var regis_mailbox='xxxxxq.com'
  var regis_password='1234ABcd..'
  var regis_password_notmatch='12345ABcd..'



  beforeEach(() => {
    cy.visit(url_regis)
  })

  it("注册，跳转到首页UI",() => {

    cy.visit(url_home)

    cy.title().should('contain','xxxxx')

    cy.get('.header-button').eq(1)
      .should('contain',' 注册 ')
      .click()

     })

  it("注册，check placeholder提示UI",() => {

    //开始注册,因为什么都没填的场景需要有输入触发，check placeholder提示
    cy.get('.form-group')
      .get('.form-control').clear()
      .get('.form-control').eq(0).should('have.attr',"placeholder",'用户名')
      .get('.form-control').eq(0).type('test')
      .get('input[maxlength="18"]')

      .get('.form-control').eq(1).should('have.attr',"placeholder",'邮箱')
      .get('.form-control').eq(1).type(regis_mailbox)

      .get('.form-control').eq(2).should('have.attr',"placeholder",'密码')
      .get('.form-control').eq(2).type(regis_password)


      .get('.form-control').eq(3).should('have.attr',"placeholder",'请输入确认密码')
      .get('.form-control').eq(3).type(regis_password)

     //不勾选协议直接提交注册,这里有个小缺陷，没法捕捉什么都没填的提示
    cy.get('input').get('.btn-block').click()
     // .should('be.disabled')

    //提交后再次注册，check提交后的提示。这里有个小缺陷就是如果是已经注册过的账号过失败
    cy.get('input').get('.agreement-checkbox').check()
    cy.get('input').get('.btn-block').click()
    .trigger('.confirm-info-dialog-content',{force: true}).get('.content-header').should('contain','验证邮件已发送！')


     })

  it("注册，check过什么都没填的场景UI",() => {

    //清空，check过什么都没填的场景,提示需要先输入再清空来触发
    cy.get('input').get('.form-control').eq(0).type('test')
                   .get('.form-control').eq(1).type('test')
                   .get('.form-control').eq(2).type('test')
                   .get('.form-control').eq(3).type('test')

    cy.get('input').get('.form-control').clear()
   //check输入为空的提示信息
    cy.get('input').get('.invalid-feedback').eq(0).should('contain','请输入用户名')
                   .get('.invalid-feedback').eq(1).should('contain','邮箱不能为空')
                   .get('.invalid-feedback').eq(2).should('contain','请输入密码')

     })

  it("注册，输入正确信息UI",() => {

    //注册，输入正确信息

    cy.get('input').get('.form-control').clear()
      .get('.form-control').eq(0).type('test')
      .get('input[maxlength="18"]')
      .get('.form-control').eq(1).type(regis_mailbox)
      .get('.form-control').eq(2).type(regis_password)
      .get('.form-control').eq(3).type(regis_password)
     })

  it("注册，过两次密码不一致的场景UI",() => {


   //check 过两次密码不一致的场景

    cy.get('input')
                   .get('.form-control').eq(2).type(regis_password)
                   .get('.form-control').eq(3).type(regis_password_notmatch)
                   .get('.invalid-feedback').should('contain','两次输入密码不一致')


     })


  it("注册，使用已经注册的账号，查看已注册过的提示UI",() => {


   //check使用刚刚已经注册的账号，查看已注册过的提示
    cy.reload()
    cy.get('input')
      .get('.form-control').eq(1).clear()
      //已经注册的邮箱可以换成任何一个已经注册过的
      .get('.form-control').eq(1).type('yuanyuan.shao@txxxxxs.com')
    cy.get('.form-group').get('.invalid-feedback').should('contain','该邮箱已注册')


     })

  it("注册，密码可见眼睛点击前后属性是否该改变UI",() => {


   //check密码可见眼睛点击前后属性是否该改变
    cy.get('.form-group').get('.input-group').get('bd-icon')
      .should('have.class','bd-icon-password-invisible').eq(0).click()
    cy.get('.form-group').get('.input-group').get('bd-icon').eq(1).click()
    cy.get('.form-group').get('.input-group').get('bd-icon').should('have.class','bd-icon-password-visible')


     })

  it("注册，check已有账号立即登录跳转UI",() => {


   //check已有账号立即登录

    cy.get('.card-form .register-extra')
      .should('contain','已有账号？')
      .children('.login-link')
      .should('contain','立即登录').click()



     })


describe("登录认证，接口" ,() => {

  var url_api_token='https://qa.xxxxxx.com/api/tokens'

  var not_verified_account='xxxxxq.com'
  var not_verified_account_password="1234ABcd.."

  var invalid_account='tesxxxxxq.com'
  var invalid_account_password="1234ABcd.."


  var invalid_password_account='yuanyuan.shao@txxxxxs.com'
  var invalid_password="1234"

  var valid_password_account='266xxxxxq.com'
  var valid_password="1234ABcd.."



  it("登录接口认证，check邮箱未验证",() => {


    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
      {"email": not_verified_account, "password": not_verified_account_password},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.body).to.have.property('message','email_not_verified')
    })

  })


  it("登录接口认证，check账号未注册，无效的用户",() => {


    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
        {"email":invalid_account, "password":invalid_account_password},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.body).to.have.property('message','user_not_found')
    })

  })

  it("登录接口认证，check账号密码不对",() => {

    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
        {"email":invalid_password_account,"password": invalid_password},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.body).to.have.property('message','invalid_credential')
    })

  })

  it("登录接口认证，check账号密码都正确",() => {

    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
        {"email":valid_password_account,"password": valid_password},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.status).eq(200)

    })

  })




})





/*


//登录模块
    cy.contains('登录').click()
      //cy.get('.form-group')
    cy.get('.form-group').eq(0)
      .type(username)
    cy.get('.has-suffix-icon')
        .type(password)
    cy.get('.btn-lg').click()

//添加project
    cy.get('.add-project').eq(0).dblclick()
    .click()
    cy.get('#_bee-name').eq(0)
    .type(project_name)
    cy.get('#_bee-tag')
      .type(project_tag)
    cy.get('.btn-primary').click()




    cy.get('.tag-content')
    .should('contain', project_tag).eq(0)
      .click()
    cy.get('.btn-outline-dark-reverse').eq(0).click({force: true})

/* 添加tool
    cy.get('.name')
    .should('contain','探索阶段')

    cy.contains('添加工具卡片').eq(0).click({force: true})

    cy.contains('自定义工具')
      .get('.bd-icon-add-circle').eq(0).click()

    cy.contains('同理心地图')
      .get('.bd-icon-add-circle').eq(1).click()

    cy.contains('用户画像')
      .get('.bd-icon-add-circle').eq(2).click()

    cy.contains('用户旅程地图')
      .get('.bd-icon-add-circle').eq(3).click()

    cy.contains('确认添加').click()



    cy.get('.cdk-drag')
      .should('contain','自定义工具')
      .children('.tool-card')
      .children('.image-section')
      .children('.button-section')
      .children('.btn-outline-dark-success').eq(0).click({force: true})

    cy.get('.title-input-dark').eq(0)
      .click(291.50,52.00,{ multiple: true },{force: true})
      .type('cypress')

    cy.get('.title-input-dark').eq(1)
      .click(291.50,114.00,{ multiple: true },{force: true})
      .type('cypress工具测试描述')

    cy.get('.bd-icon-shape')


    cy.get('.cdk-drag')
      .should('contain','用户画像')
      .children('.tool-card')
      .children('.image-section')
      .children('.button-section')
      eq是控制选择tool下面第几个tool
      .children('.btn-outline-dark-success').eq(1).click({force: true})


*/








})





describe("登录页面UI" ,() => {



  var project_name='cypresstest9'
  var project_tag='cypresstest9'

  var url_home='https://qa.xxxxxx.com/zh-CN/'
  var url_login='https://qa.xxxxxx.com/zh-CN/auth/login'
  var url_regis='https://qa.xxxxxx.com/zh-CN/auth/register'



  beforeEach(() => {
    cy.visit(url_login)
  })


    it("登录首页banner，登录UI",() => {


    cy.get('.banner-info').should('contain','抗击疫情 共克时艰，xxxxx 助力远程协作，让产品设计不间断！ ')
    cy.contains('登录').click()
    cy.get('.form-group').eq(0)
                         .type('y1204xxxxx3.com')
    cy.get('.has-suffix-icon')
                         .type("1234ABcd..")
    cy.get('.btn-lg').click()

  })


  it("登录页面，check不填邮箱密码的提示和placeholder",() => {

    cy.get('input')
      .get('.form-control').eq(0).should('have.attr','placeholder','邮箱')
      .get('.form-control').eq(1).should('have.attr','placeholder','密码')
      .clear()
      .get('.form-control').eq(0).type('test')
      .get('.invalid-feedback').eq(0).should('contain','请输入格式正确的邮箱地址')
      //可以使用任意已经注册的邮箱
      .get('.form-control').eq(0).type('yuanyuan.shao@txxxxxs.com')
      .get('.invalid-feedback').eq(1).should('contain','请输入密码')

  })




  it("登录页面，check用户已经注册但是没有激活的场景，UI",() => {

    cy.get('input')
      .get('.form-control').eq(0).type('xxxxxq.com')
    cy.get('input') .get('.form-control').eq(1).type('1234ABcd..')
    cy.get('.btn-lg').click()
    cy.get('.confirm-info-modal-content')
      .should('contain','该邮箱已注册，请前往激活')
      .should('contain','我们已将验证电子邮件发送至您的电子邮箱地址，请单击电子邮件中的链接以激活您的账号。')
    cy.get('.confirm-info-modal-content').find('.btn')

  })



  it("登录页面，check不填邮箱密码的提示和placeholder，UI",() => {

    cy.get('input')
      .get('.form-control').eq(0).should('have.attr','placeholder','邮箱')
      .get('.form-control').eq(1).should('have.attr','placeholder','密码')
      .clear()
      .get('.form-control').eq(0).type('test')
      .get('.invalid-feedback').eq(0).should('contain','请输入格式正确的邮箱地址')
      .get('.form-control').eq(0).type('yuanyuan.shao@txxxxxs.com')
      .get('.invalid-feedback').eq(1).should('contain','请输入密码')

  })


/*
    cy.get('.tag-content')
    .should('contain', project_tag).eq(0)
      .click()
    cy.get('.btn-outline-dark-reverse').eq(0).click({force: true})




    cy.get('.name')
    .should('contain','探索阶段')

    cy.contains('添加工具卡片').eq(0).click({force: true})

    cy.contains('自定义工具')
      .get('.bd-icon-add-circle').eq(0).click()

    cy.contains('同理心地图')
      .get('.bd-icon-add-circle').eq(1).click()

    cy.contains('用户画像')
      .get('.bd-icon-add-circle').eq(2).click()

    cy.contains('用户旅程地图')
      .get('.bd-icon-add-circle').eq(3).click()

    cy.contains('确认添加').click()



    cy.get('.cdk-drag')
      .should('contain','自定义工具')
      .children('.tool-card')
      .children('.image-section')
      .children('.button-section')
      .children('.btn-outline-dark-success').eq(0).click({force: true})

    cy.get('.title-input-dark').eq(0)
      .click(100,52.00,{force: true})
      .type('cypress工具测试')

    cy.get('bd-icon').click()




    cy.get('.cdk-drag')
      .should('contain','用户画像')
      .children('.tool-card')
      .children('.image-section')
      .children('.button-section')
      eq是控制选择tool下面第几个tool
      .children('.btn-outline-dark-success').eq(1).click({force: true})








   //cy.contains('cypress').click()
     //cy.request('POST', '/api/tokens', {
      //body: '{"email":"y1204xxxxx3.com","password":"1234ABcd.."}'
    //}).its('body')
      // .as('currentUser')

*/


})

