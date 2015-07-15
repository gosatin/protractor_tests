var fs = require('fs');

describe('weather.com', function() {
  var credentials = JSON.parse(fs.readFileSync('e2e/credentials.json', 'utf8'));

  it('should login', function() {
    browser.get('http://www.weather.com/');
    browser.sleep(5000);  //or wait for page to load by checking it's state
    expect(browser.getTitle()).toEqual('National and Local Weather Forecast, Hurricane, Radar and Report');

    $('.login').click();
    browser.switchTo().frame($('iframe[src="https://profile.weather.com/login.html#/login"]').getWebElement())  // remove '.getWebElement' after fix https://github.com/angular/protractor/issues/1846

    browser.ignoreSynchronization = true;
    var loginWithGoogleBtn = $('#btn-google-plus');
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(loginWithGoogleBtn));
    loginWithGoogleBtn.click();

    //select popup
    browser.getWindowHandle().then(function(currentWindow) {
      browser.getAllWindowHandles().then(function(handlesArr) {
        // convert array to single value by selecting 'left' element if it's not
        // current handle, and selecting 'right' otherwise.
        var popupHandle = handlesArr.reduce(function(left, right) {
          return left == currentWindow ? right : left;
        });
      
        //switch to login window, type email and password, then click Sign In
        browser.switchTo().window(popupHandle);
        // disable 'angularjs' mode back
        browser.ignoreSynchronization = true;
        $('#Email').sendKeys(credentials.email);
        $('#next').click();
        var passwdFld = $('#Passwd');
        browser.sleep(2000);
        passwdFld.sendKeys(credentials.password);
        $('#signIn').click();
        //select main window back
        browser.switchTo().window(currentWindow);
        browser.ignoreSynchronization = false;
        browser.waitForAngular();

        // check we're on the right page
        expect(browser.getTitle()).toEqual('National and Local Weather Forecast, Hurricane, Radar and Report');
        browser.sleep(2000);
        // check user was signed in
        expect($('.wx-sign-in .label').getText()).toBe('My Profile');

        // the rest of the test code goes here
      });
    });
  });
});
