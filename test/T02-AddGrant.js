 describe('Add grant', function () {
	it('should add a new grant', function (){
		browser.get("https://si1718-flp-grants-si1718curro.c9users.io/#!/create");

		element.all(by.repeater('grant in grants')).then(function (initialGrants){
				browser.driver.sleep(2000);
	
				element(by.model('newGrant.title')).sendKeys('sdadsadasdsad');
				element(by.model('newGrant.reference')).sendKeys('ldufufdiugodfuigdf');
				element(by.model('newGrant.startDate')).sendKeys('asodpisaopidpaisdposaid');
				element(by.model('newGrant.endDate')).sendKeys('OASPDSIXCVKXCLVX');
				element(by.model('newGrant.type')).sendKeys('oaiodsoduasiduase');
				element(by.model('newGrant.leaders')).sendKeys(['aisoaDUITSBDSBC', 'skadjlaskjdlkajdla']);
				element(by.model('newGrant.fundingOrganizations')).sendKeys(['aisoaDUITSBDSBC', '9890438jkejhdasfjpowdsf']);
				element(by.model('newGrant.temMembers')).sendKeys(['psaòdsf7ew9rehr', 'sods`pdfo9ueirfoefdk']);

				element(by.buttonText('Add')).click().then(function (){

					element.all(by.repeater('grant in grants')).then(function (grants){
						expect(grants.length).toEqual(initialGrants.length+1);
					});
				
				});
			
		});
	});
});