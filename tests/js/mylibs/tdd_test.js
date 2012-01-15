TestCase("NamespaceTest", {
    tearDown: function () {
        delete tddjs.nstest;
    },  

    "test should create non-existent object":
    function () {
        tddjs.namespace("nstest");

        assertObject(tddjs.nstest);
    },  

    "test should not overwrite existing objects":
    function () {
        tddjs.nstest = { nested: {} };
        var result = tddjs.namespace("nstest.nested");

        assertSame(tddjs.nstest.nested, result);
    },  

    "test only create missing parts":
    function () {
        var existing = {};
        tddjs.nstest = { nested: { existing: existing } };
        var result = tddjs.namespace("nstest.nested.ui");
    
        assertSame(existing, tddjs.nstest.nested.existing);
        assertObject(tddjs.nstest.nested.ui);
    },
    
    "test namespacing inside other objects":
    function () {
        var custom = { namespace: tddjs.namespace };
        custom.namespace("dom.event");
    
        assertObject(custom.dom.event);
        assertUndefined(tddjs.dom);
    }
});

TestCase("UidTest", {
    "test should retrun nemeric id":
    function () {
        var id = tddjs.uid({});

        assertNumber(id);
    },

    "test should return consistent id for object":
    function () {
        var object = {};
        var id = tddjs.uid(object);

        assertSame(id, tddjs.uid(object));
    },

    "test should return unique id":
    function () {
        var object = {};
        var object2 = {};
        var id = tddjs.uid(object);

        assertNotEquals(id, tddjs.uid(object2));
    },

    "test should return consistent id for function":
    function () {
        var func = function () {};
        var id = tddjs.uid(func);

        assertSame(id, tddjs.uid(func));
    },

    "test should return undefined for primitive":
    function () {
        var str = "my string";

        assertUndefined(tddjs.uid(str));
    }
});

TestCase("IteratorTest", {
    "test next should return first item":
    function () {
        var collection = [1, 2, 3, 4, 5];
        var iterator = tddjs.iterator(collection);
        assertSame(collection[0], iterator.next());
        assertTrue(iterator.hasNext());
    },

    "test hasNext should be false after last item":
    function () {
        var collection = [1, 2];
        var iterator = tddjs.iterator(collection);

        iterator.next();
        iterator.next();

        assertFalse(iterator.hasNext());
    },

    "test should loop collection with iterator":
    function () {
        var collection = [1, 2, 3, 4, 5];
        var it = tddjs.iterator(collection);
        var result = [];

        while (it.hasNext()) {
            result.push(it.next());
        }

        assertEquals(collection, result);
    }
});

TestCase("ObjectLoopTest", {
    "test looping should only iterate over own properties":
    function () {
        var person = {
            name: "Christian",
            profession: "Programmer",
            location: "Norway"
        };

        var result = [];

        for (var prop in person) {
            if (person.hasOwnProperty(prop)) {
                result.push(prop);
            }
        }

        var expected = ["location", "name", "profession"];
        assertEquals(expected, result.sort());
    }
});

TestCase("PropertyEnumerationTest", {
    "test should enumerate shadowed object properties.":
    function () {
        var object = {
            toString: "toString",
            toLocaleString: "toLocaleString",
            valueOf: "valueOf",
            hasOwnProperty: "hasOwnProperty",
            isPrototypeOf: "isPrototypeOf",
            propertyIsEnumerable: "propertyIsEnumerable",
            constructor: "constructor"
        };

        var result = [];

//      for (var property in object) {
//          result.push(property);
//      }
        tddjs.each(object, function (property) {
            result.push(property);
        }); 

        assertEquals(7, result.length);
    },
    
    "test should enumerate shadowed function properties":
    function () {
        var object = function () {};

        object.prototype = "prototype";
        object.call = "call";
        object.apply = "apply";

        var result = [];

//      for (var property in object) {
//          result.push(property);
//      }
        tddjs.each(object, function (property) {
            result.push(property);
        }); 

        assertEquals(3, result.length);
    }
});

TestCase("ObjectExtendTest", {
    setUp: function () {
        this.dummy = {
            setName: function (name) {
                return (this.name = name);
            },

            getName: function () {
                return this.name || null;
            }
        };
    },

    "test should copy properties":
    function () {
        var object = {};
        tddjs.extend(object, this.dummy);

        assertEquals("function", typeof object.getName);
        assertEquals("function", typeof object.setName);
    },

    "test should return new object when source is null":
    function () {
        var object = tddjs.extend(null, this.dummy);

        assertEquals("function", typeof object.getName);
        assertEquals("function", typeof object.setName);
    },


    "test should return target untouched when no source":
    function () {
        var object = tddjs.extend({});
        var properties = [];

        for (var prop in object) {
            if (tddjs.isOwnProperty(object, prop)) {
                properties.push(prop);
            }
        }

        assertEquals(0, properties.length);
    }
});
