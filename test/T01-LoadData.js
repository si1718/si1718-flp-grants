var fs = require('fs');

function writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
}

describe('Data is loaded',function  (){
   it('Should show a list of more than two grants', function (){
       browser.get("https://si1718-flp-grants-si1718curro.c9users.io/#!/list");
       var grants = element.all(by.repeater('grant in grants'));
       browser.driver.sleep(2000);
       
       browser.takeScreenshot().then(function (png) {
    			writeScreenShot(png, 'ng-test.png');
    	});
    	
       expect(grants.count()).toBeGreaterThan(2);
   });
});