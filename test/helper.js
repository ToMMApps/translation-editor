describe('helper', function(){
    var expect = require("expect.js");
    var helper = require('./../lib/helper.js');

    describe("search", function(){
        it("should not find a key in an empty object", function(done){
            helper.search("key", {}).then(function(result){
                expect(result).to.be(null);
                done();
            }).catch(console.error);
        });

        it("should not find a key if it does not exist", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        KEY: "value"
                    }
                }
            };

            helper.search("KEY", translationObject).then(function(result){
                expect(result).to.be(null);
                done();
            }).catch(console.error);
        });

        it("should find a key if it exists", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        KEY: "value"
                    }
                }
            };

            helper.search("TEST.TEST.KEY", translationObject).then(function(result){
                expect(result).to.eql({
                    translation: "value",
                    history: [translationObject, translationObject.TEST, translationObject.TEST.TEST],
                    propName: "KEY"
                });
                done();
            }).catch(console.error);
        });

        it("should find a key in the root if it exists", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        KEY: "value"
                    }
                },
                KEY: "value2"
            };

            helper.search("KEY", translationObject).then(function(result){
                expect(result).to.eql({
                    translation: "value2",
                    history: [translationObject],
                    propName: "KEY"
                });
                done();
            }).catch(console.error);
        });

        it("should throw a type error if the key is not a string", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        KEY: "value"
                    }
                },
                KEY: 2
            };

            helper.search("KEY", translationObject).then(function(result){
            }).catch(function(err){
                expect(err.name).to.be('TypeError');
                done();
            });
        });
    })
});