describe('api', function(){
    var expect = require("expect.js");
    var api = require('./../index');
    var helper = require('./../lib/helper');

    describe("addKey", function(){
        var translationObject = {};

        it("should reject if the overhanded translation object is null", function (done) {
            api.addKey("KEY", "VALUE", null).catch(function (err) {
                expect(err).to.be.an('object');
                done();
            });
        });

        it("should return a reference to the overhanded translationObject", function(done){
            api.addKey("KEY", "VALUE", translationObject).then(function(result){
                expect(result).to.be(translationObject);
                done();
            }).catch(console.error);
        });

        it("should add a key to an empty object", function(done){
            api.addKey("KEY", "VALUE", {}).then(function(result){
                expect(result).to.eql({
                    KEY: "VALUE"
                });
                done();
            }).catch(console.error);
        });

        it("should create necessary objects", function(done){
            api.addKey("TEST.TEST.KEY", "VALUE", {}).then(function(result){
                expect(result).to.eql({
                    TEST: {
                        TEST: {
                            KEY: "VALUE"
                        }
                    }
                });
                done();
            }).catch(console.error);
        });

        it("should reject if an existing element would be overwritten (key without dot)", function(done){
            var translationObject = {
                KEY: "VALUE"
            };

            api.addKey("KEY", "otherValue", translationObject).then(function(result){
            }).catch(function(){
                expect(translationObject).to.eql({
                    KEY: "VALUE"
                });
                done();
            });
        });

        it("should reject if an existing element would be overwritten (key with dot)", function(done){
            var translationObject = {
                KEY: {
                    OTHER_KEY: "VALUE"
                }
            };

            api.addKey("KEY.OTHER_KEY", "otherValue", translationObject).then(function(result){
            }).catch(function(){
                expect(translationObject).to.eql({
                    KEY: {
                        OTHER_KEY: "VALUE"
                    }
                });
                done();
            });
        })
    });

    describe("delKey", function(){
        it("should return a reference to the overhanded translationObject", function(done){
            var translationObject = {
                KEY: "VALUE"
            };

            api.delKey("KEY", translationObject).then(function(result){
                expect(result).to.be(translationObject);
                done();
            }).catch(console.error);
        });

        it("should reject if the key does not exist", function(done){
            api.delKey("key", {}).catch(function(){
                done();
            });
        });

        it("should delete a key in the root object", function(done){
            api.delKey("key", {key: "value", otherKey: "otherValue"}).then(function(result){
                expect(result).to.eql({
                    otherKey: "otherValue"
                });
                done();
            });
        });

        it("should remove empty objects", function(done){
            var translationObject = {
                TEST: {
                    SUB_TEST: {
                        KEY: "value"
                    }
                }
            };

            api.delKey("TEST.SUB_TEST.KEY", translationObject)
                .then(function(result){
                    expect(result).to.eql({});
                    done();
                });
        });
        it("should not remove non-empty objects", function(done){
            var translationObject = {
                TEST: {
                    SUB_TEST: {
                        KEY: "value"
                    },
                    OTHER_SUB_TEST: {
                        KEY: "value"
                    }
                }
            };

            api.delKey("TEST.SUB_TEST.KEY", translationObject)
                .then(function(result){
                    expect(result).to.eql({
                        TEST: {
                            OTHER_SUB_TEST: {
                                KEY: "value"
                            }
                        }
                    });
                    done();
                }).catch(console.error);
        });
    });

    describe("getValue", function(){
        it("should resolve to null if the given key was not found", function(done){
            var translationObject = {
                KEY: "VALUE"
            };

            api.getValue("OTHER_KEY", translationObject).then(function(result){
                expect(result).to.be(null);
                done();
            }).catch(console.error);
        });

        it("should resolve to the correct value", function(done){
            var translationObject = {
                KEY: "VALUE"
            };

            api.getValue("KEY", translationObject).then(function(result){
                expect(result).to.be("VALUE");
                done();
            }).catch(console.error);
        });
    });

    describe("keyExists", function(){
        it("should resolve to true if the key exists", function(done){
            var translationObject = {
                TEST: {
                    KEY: "value"
                }
            };

            api.keyExists("TEST.KEY", translationObject).then(function(result){
                expect(result).to.be(true);
                done();
            }).catch(console.error);
        });

        it("should resolve to false if the key does not exist", function(done){
            var translationObject = {
                TEST: {
                    KEY: "value"
                }
            };

            api.keyExists("TEST.TEST.KEY", translationObject).then(function(result){
                expect(result).to.be(false);
                done();
            }).catch(console.error);
        });

    });

    describe("changeKey", function(){
        it("should return a reference to the overhanded translationObject", function(done){
            var translationObject = {
                OLD_KEY: "VALUE"
            };

            api.changeKey("OLD_KEY", "NEW_KEY", translationObject).then(function(result){
                expect(result).to.be(translationObject);
                done();
            }).catch(console.error);
        });

        it("should change a key in the root object", function(done){
            var translationObject = {
                OLD_KEY: "VALUE"
            };

            api.changeKey("OLD_KEY", "NEW_KEY", translationObject).then(function(result){
                expect(result).to.eql({
                    NEW_KEY: "VALUE"
                });
                done();
            }).catch(console.error);
        });

        it("should change a key in different objects", function(done){
            var translationObject = {
                OLD_KEY: "VALUE"
            };

            api.changeKey("OLD_KEY", "TEST.TEST.NEW_KEY", translationObject).then(function(result){
                expect(result).to.eql({
                    TEST: {
                        TEST: {
                            NEW_KEY: "VALUE"
                        }
                    }
                });
                done();
            }).catch(console.error);
        });

        it("should remove empty objects", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        OLD_KEY: "VALUE"
                    }
                }
            };

            api.changeKey("TEST.TEST.OLD_KEY", "NEW_KEY", translationObject).then(function(result){
                expect(result).to.eql({
                    NEW_KEY: "VALUE"
                });
                done();
            }).catch(console.error);
        });

        it("should reject if the new key does already exist", function(done){
            var translationObject = {
                TEST: {
                    TEST: {
                        OLD_KEY: "VALUE"
                    }
                },
                NEW_KEY: "other"
            };

            api.changeKey("TEST.TEST.OLD_KEY", "NEW_KEY", translationObject).catch(function(){
                expect(translationObject).to.eql({
                    TEST: {
                        TEST: {
                            OLD_KEY: "VALUE"
                        }
                    },
                    NEW_KEY: "other"
                });
                done();
            });
        });
    });

    describe("updateValue", function() {
        var translationObject = {
            KEY: "oldValue"
        };

        it("should replace the value correctly", function (done) {
            api.updateValue("KEY", "newValue", translationObject).then(function (result) {
                expect(result).to.eql({
                    KEY: "newValue"
                });
                done();
            }).catch(console.error);
        });
    });

});