var fs = require('fs'),
    screenshots_path = '/tmp/screenshots/';

/**
 * Creates screenshots dir
 */
try {
  fs.mkdirSync(screenshots_path);
} catch(e) {
  if ( e.code != 'EEXIST' ) throw e;
}

var saveScreenshot = function(png_data, suffix) {
  var stream = fs.createWriteStream(screenshots_path + 'screenshot_' + suffix + '.png');
  stream.write(new Buffer(png_data, 'base64'));
  stream.end();
};

var viewportHeight = function() {
  return browser.executeScript(function() {
    return window.innerHeight;
  });
};

var documentHeight = function() {
  return browser.executeScript(function() {
    return document.body.clientHeight;
  });
};

/**
 * Takes multiple screenshots of the page by scrolling down the page.
 * If page has a fixed header that remains while scrolling put it's height as
 * a parameter to scroll less and capture all the data, otherwise use 0.
 * Saves screenshots with '_{counter}_startPos{startPos}' suffix where {startPos} indicates the size of repeated header
 * @param {int} headerHeight - size of fixed header
 */
var takeLongScreenshotWithHeader = function(headerHeight) {
  viewportHeight().then(function(viewportHeight) {
    documentHeight().then(function(documentHeight) {
      var partCounter = 1,
          scrollSize = viewportHeight - headerHeight;

      var scrollAndTakeScreenshot = function(targetYPos) {
        browser.executeScript(function(ypos) {
          window.scrollTo(0, ypos);
          return window.pageYOffset;
        }, targetYPos).then(function(actualYPos) {
	  browser.sleep(32);
          browser.takeScreenshot().then(function(data) {
            var overlapHeight = targetYPos - actualYPos;
            // Cases:
            // * actualYPos = 0 (first screenshot)
            // * headerHeight + overlap (0 for normal screenshots) in other screenshots
            var startPos = actualYPos < headerHeight ? actualYPos : headerHeight + overlapHeight
            saveScreenshot(data, partCounter++ + '_startPos' + startPos);
            if ((targetYPos + scrollSize) <= documentHeight) {
              scrollAndTakeScreenshot(targetYPos + scrollSize);
            }
          });
        });
      };
      scrollAndTakeScreenshot(0);
    });
  });
}

describe('creator academy', function() {
  it('should have a page title', function() {
    browser.get('http://creatoracademy.withgoogle.com');

    browser.sleep(2000);  //or wait for page to load by checking it's state
    takeLongScreenshotWithHeader(87);   

    expect(browser.getTitle()).toEqual('Creator Academy - YouTube');
  });
});
