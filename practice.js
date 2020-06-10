

describe("注册页面的用例，UI" ,() => {


  function regis_mailbox() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+"@qq.com";
  }

//xxxx注册和登录页面的Demo，暂时没分cases，所以部分步骤间都有依赖
//局限性是以下的project_name，regis_mailbox参数成功创建后下一次需要更改否则会报错

  var url_home='https://qa.xxxx.xxx.com/zh-CN/'
  var url_login='https://qa.xxxx.xxx.com/zh-CN/auth/login'
  var url_regis='https://qa.xxxx.xxx.com/zh-CN/auth/register'


  var project_name='cypresstest17'
  var project_tag='cypresstest17'

  var username='y1nnnnn'
  var auth='1234ABcd..mmm'

 // var regis_mailbox='test28@qq.com'
  var regis_auth='1234AffffBcd..'
  var regis_auth_notmatch='12345ABcd..'



  beforeEach(() => {
    cy.visit(url_regis)
  })

  it("注册，跳转到首页UI",() => {

    cy.visit(url_home)

    cy.title().should('contain','xxxx')




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
      .get('.form-control').eq(1).type(regis_mailbox())

      .get('.form-control').eq(2).should('have.attr',"placeholder",'密码')
      .get('.form-control').eq(2).type(regis_auth)


      .get('.form-control').eq(3).should('have.attr',"placeholder",'请输入确认密码')
      .get('.form-control').eq(3).type(regis_auth)

     //不勾选协议直接提交注册,这里有个小缺陷，没法捕捉没勾选协议的提示
    cy.get('input').get('.btn-block').click()
     // .should('be.disabled')

    //提交后再次注册，check提交后的提示。这里有个小缺陷就是如果是已经注册过的账号过失败
    cy.get('input').get('.agreement-checkbox').check()
    cy.get('input').get('.btn-block').click()
    .trigger('.confirm-info-dialog-content',{force: true}).get('.content-header').should('contain','该邮箱已注册，请在7天内前往激活')


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
      .get('.form-control').eq(1).type(regis_mailbox())
      .get('.form-control').eq(2).type(regis_auth)
      .get('.form-control').eq(3).type(regis_auth)


    cy.get('input').get('.agreement-checkbox').check()
    cy.get('input').get('.btn-block').click()
    .trigger('.confirm-info-dialog-content',{force: true}).get('.content-header').should('contain','该邮箱已注册，请在7天内前往激活')





     })

  it("注册，过两次密码不一致的场景UI",() => {


   //check 过两次密码不一致的场景

    cy.get('input')
                   .get('.form-control').eq(2).type(regis_auth)
                   .get('.form-control').eq(3).type(regis_auth_notmatch)
                   .get('.invalid-feedback').should('contain','两次输入密码不一致')


     })


  it("注册，使用已经注册的账号，查看已注册过的提示UI",() => {


   //check使用刚刚已经注册的账号，查看已注册过的提示
    cy.reload()
    cy.get('input')
      .get('.form-control').eq(1).clear()
      //已经注册的邮箱可以换成任何一个已经注册过的
      .get('.form-control').eq(1).type('xxx@tworkfffs.com')
    cy.get('.form-group').get('.invalid-feedback').should('contain','该邮箱已注册')


     })

  it("注册，密码可见眼睛点击前后属性是否该改变UI",() => {


   //check密码可见眼睛点击前后属性是否该改变
    cy.get('.form-group').get('.input-group').get('bd-icon')
      .should('have.class','bd-icon-auth-invisible').eq(0).click()
    cy.get('.form-group').get('.input-group').get('bd-icon').eq(1).click()
    cy.get('.form-group').get('.input-group').get('bd-icon').should('have.class','bd-icon-auth-visible')


     })

  it("注册，check已有账号立即登录跳转UI",() => {

   //check已有账号立即登录

    cy.get('.card-form .register-extra')
      .should('contain','已有账号？')
      .children('.login-link')
      .should('contain','立即登录').click()


     })
  it("注册，用户协议和隐私声明UI",() => {



    cy.get('.form-btn-group').get('.agreement').find('a')
      .first().should('have.attr','href','https://qa.hello-xxx.com/auth/agreement')
      .click()

        .then(($a) => {
          // 从<a>中取出完全限定的href
          const url = $a.prop('href')

          // 向它发起cy.request
          cy.request(url)
            .its('body')
            .title('Helloxxx')

        })

        cy.get('.form-btn-group').get('.agreement').find('a')
          .last().should('have.attr','href','https://qa.hfrrr-xxx.com/auth/privacy')
          .click()
         .then(($a) => {
          // 从<a>中取出完全限定的href
          const url = $a.prop('href')

          // 向它发起cy.request
          cy.request(url)
            .its('body')
            .title('Helloxxx')

        })
     })


describe("登录认证，接口" ,() => {

  var url_api_token='https://qa.xxxx.hellorrrr-xxx.com/api/tokens'

  var not_verified_account='test25rrqq.com'
  var not_verified_account_auth="1234rABcd.."

  var invalid_account='testwahaha@qq.com'
  var invalid_account_auth="1234ABcd.."


  var invalid_auth_account='xxx@xxx.com'
  var invalid_auth="1234"

  var valid_auth_account='26655725rrrr81@qq.com'
  var valid_auth="1234ABcd.."



  it("登录接口认证，check邮箱未验证",() => {


    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
      {"email": not_verified_account, "auth": not_verified_account_auth},
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
        {"email":invalid_account, "auth":invalid_account_auth},
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
        {"email":invalid_auth_account,"auth": invalid_auth},
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
        {"email":valid_auth_account,"auth": valid_auth},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.status).eq(200)

    })

  })


  for(let n = 0; n < 10; n ++){

   it("账号重复10次输入错误",() => {

    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
        {"email":'anryan2020@sina.com',"auth": invalid_auth},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.body).to.have.property('message','invalid_credential')
    })
    cy.log('第 $n 次输错密码')
  })

  }

  it("登录接口认证，安全-check十次密码不对后的返回",() => {

    cy.request({
      method: 'POST',
      url: url_api_token,
      failOnStatusCode: false,
      body:
        {"email":'anryan2020@sina.com',"auth": invalid_auth},
      headers:
        {
          'content-type': 'application/json'

        }
    }).should((response)=>{
      expect(response.body).to.have.property('message','account_locked')
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
        .type(auth)
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

  var url_home='https://qa.xxxx.hello-xxx.com/zh-CN/'
  var url_login='https://qa.xxxx.hello-xxx.com/zh-CN/auth/login'
  var url_regis='https://qa.xxxx.hello-xxx.com/zh-CN/auth/register'



  beforeEach(() => {
    cy.visit(url_login)
  })


    it("登录首页banner，登录UI",() => {


    cy.get('.banner-info').should('contain','抗击疫情 共克时艰，xxxx 助力远程协作，让产品设计不间断！ ')
    cy.contains('登录').click()
    cy.get('.form-group').eq(0)
                         .type('y1204140217@163.com')
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
      .get('.form-control').eq(0).type('xxx@thougtworks.com')
      .get('.invalid-feedback').eq(1).should('contain','请输入密码')

  })




  it("登录页面，check用户已经注册但是没有激活的场景，UI",() => {

    cy.get('input')
      .get('.form-control').eq(0).type('test25@qq.com')
    cy.get('input') .get('.form-control').eq(1).type('1234ABcd..')
    cy.get('.btn-lg').click()
    cy.get('.confirm-info-modal-content')
      .should('contain','该邮箱已注册，请在7天内前往激活')
      .should('contain','若链接已失效，可点击下方的「重新发送邮件」按钮，我们将重新向您的电子邮件地址发送一封验证邮件，请单击电子邮件中的链接以激活您的账号。')
      .should('have.attr','type','resend')
    cy.get('.confirm-info-modal-content').find('.btn')

  })



  it("登录页面，check不填邮箱密码的提示和placeholder，UI",() => {

    cy.get('input')
      .get('.form-control').eq(0).should('have.attr','placeholder','邮箱')
      .get('.form-control').eq(1).should('have.attr','placeholder','密码')
      .clear()
      .get('.form-control').eq(0).type('test')
      .get('.invalid-feedback').eq(0).should('contain','请输入格式正确的邮箱地址')
      .get('.form-control').eq(0).type('xxx@thougtworks.com')
      .get('.invalid-feedback').eq(1).should('contain','请输入密码')

  })



})

//登录后的操作模块-project
describe("登录后的页面UI" ,() => {
  function project_name() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

   var project_tag='beeart_tag'

   it("登录后检查project页面",() => {
      cy.visit('https://qa.beeart.hello-bees.com/zh-CN/')
        .contains(' 联系我们')
      cy.contains('登录').click()
      //cy.get('.form-group')
      cy.get('.form-group').eq(0)
        .type('y1204140217@163.com')
      cy.get('.has-suffix-icon')
        .type("1234ABcd..")
      cy.get('.btn-lg').click()



      cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .should('have.length','7')
        .eq(0).should('contain','项目')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(1).should('contain','社区')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(2).should('contain','全部')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(3).should('contain','精华工作坊')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(4).should('contain','创新0-1')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(5).should('contain','流程优化')
     cy.get('.row').get('.col').get('.ng-untouched>ul').get('li')
        .eq(6).should('contain','其他')
//检查搜索功能
     cy.get('.align-items-center').find('.bd-icon-content').click()
       .get('.form-control')
       .should('have.attr','placeholder','请输入项目名称')
       .focus()
       .type('test')



    cy.get('.project-dropdown').get('.dropdown-toggle').eq(2).click()
     cy.get('.dropdown-menu>li')
       .should('have.length','3')

     cy.get('.project-dropdown').get('.dropdown-toggle').eq(1).click()



     })


  it("登录后创建project",() => {
      cy.visit('https://qa.beeart.hello-bees.com/zh-CN/')
        .contains(' 联系我们')
      cy.contains('登录').click()
      //cy.get('.form-group')
      cy.get('.form-group').eq(0)
        .type('y1204140217@163.com')
      cy.get('.has-suffix-icon')
        .type("1234ABcd..")
      cy.get('.btn-lg').click()

      cy.get('.add-project').eq(0).dblclick()
        .click()
      cy.get('#_bee-name').eq(0)
        .type(project_name())
      cy.get('#_bee-tag')
        .type(project_tag)
      cy.get('.btn-primary').click()

     })

  it("登录后添加工具", () => {
    cy.visit('https://qa.beeart.hello-bees.com/zh-CN/')
      .contains(' 联系我们')
    cy.contains('登录').click()
    //cy.get('.form-group')
    cy.get('.form-grorrrup').eq(0)
      .type('y1204140217@163.com')
    cy.get('.has-suffix-icon')
      .type("1234ABcd..")
    cy.get('.btn-lg').click()

    cy.get('.tag-content')
      .should('contain', project_tag).eq(0)
      .click()
    cy.get('.btn-outline-dark-reverse').eq(0).click({force: true})


///单个添加工具
    cy.get('app-tool').find('.lane-content').get('.add-card').eq(0).click()
      .get('app-tool-template-card').eq(1)
      .find('.bd-icon-add-circle').click()
    cy.contains('确认添加').click()

    cy.get('app-tool').find('.lane-content').get('.add-card').eq(0).click()
      .get('app-tool-template-card').eq(2)
      .find('.bd-icon-add-circle').click()
    cy.contains('确认添加').click()

    cy.get('app-tool').find('.lane-content').get('.add-card').eq(0).click()
      .get('app-tool-template-card').eq(3)
      .find('.bd-icon-add-circle').click()
    cy.contains('确认添加').click()

//批次添加工具

    cy.get('app-tool').find('.lane-content').get('.add-card').eq(1).click()
      .get('app-tool-template-card').should('have.length','7')
      .get('app-tool-template-card').eq(0)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(0).should('have.attr','alt','自定义工具')
      .get('app-tool-template-card').eq(1)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(1).should('have.attr','alt','同理心地图')
      .get('app-tool-template-card').eq(2)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(2).should('have.attr','alt','用户画像')
      .get('app-tool-template-card').eq(3)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(3).should('have.attr','alt','用户旅程地图')
      .get('app-tool-template-card').eq(4)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(4).should('have.attr','alt','痛点归因')
      .get('app-tool-template-card').eq(5)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(5).should('have.attr','alt','电梯演讲')
      .get('app-tool-template-card').eq(6)
      .find('.bd-icon-add-circle').click()
      .get('img').eq(6).should('have.attr','alt','象限分析')
    cy.contains('确认添加').click()


  })

})

