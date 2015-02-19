world = new ReactiveDict();
world.Objects = new Meteor.Collection(null);
world.Layers = new Meteor.Collection(null);

One.registerPlugin('fps', function() {
  var plugin = {};

  plugin.update = function() {
    One.set('fps', 'ts', new Date().getTime());

    if (plugin.running) {
      requestAnimationFrame(plugin.update);
    }
  };

  plugin.onStart = function() {
    plugin.running = true;
    plugin.update();
  };

  plugin.onStop = function() {
    plugin.running = false;
  };

  return plugin;
});

world.createCloud = function() {
  var cloud = {
    _id: Random.id(),
    x: 256 - (Math.random() * 512),
    y: 256 - (Math.random() * 512),
    z: 256 - (Math.random() * 512)
  };

  cloud.layers = [];

  for (var j = 0; j < 5 + Math.round(Math.random() * 10); j++) {
    var x = 256 - (Math.random() * 512);
    var y = 256 - (Math.random() * 512);
    var z = 100 - (Math.random() * 200);
    var a = Math.random() * 360;
    var s = .25 + Math.random();
    x *= .2;
    y *= .2;

    var layer = {
      cloudId: cloud._id,
      x: x,
      y: y,
      z: z,
      a: a,
      s: s,
      speed: .1 * Math.random()
    };

    world.Layers.insert(layer);
  }

  return cloud;
};

world.generate = function() {
  world.Objects.remove({});
  world.Layers.remove({});

  for (var j = 0; j < 5; j++) {
    world.Objects.insert(world.createCloud());
  }
};

Template.World.rendered = function() {
  world.set('d', 0);

  world.generate();

  this.autorun(function() {
    var pageX = One.get('mouse', 'pageX');
    var pageY = One.get('mouse', 'pageY');

    var yAngle = -(.5 - (pageX / window.innerWidth)) * 180;
    var xAngle = (.5 - (pageY / window.innerHeight)) * 180;

    world.set('yAngle', yAngle);
    world.set('xAngle', xAngle);
  });

  this.autorun(function() {
    var ts = One.get('fps', 'ts');
    var xAngle = world.get('xAngle');
    var yAngle = world.get('yAngle');

    // world.Layers.update({}, {
    //   $inc: {
    //     a: .1 * Math.random()
    //   }
    // }, {
    //   multi: true
    // });
    //
    Tracker.nonreactive(function() {
      world.Layers.find().forEach(function(layer) {
        world.Layers.update(layer._id, {
          $set: {
            a: layer.a + layer.speed
          }
        });
      });
    });
  });
};

Template.World.helpers({
  clouds: function() {
    return world.Objects.find();
  },

  style: function() {
    return 'transform: translateZ( ' + world.get('d') + 'px ) \
        rotateX( ' + world.get('xAngle') + 'deg) \
        rotateY( ' + world.get('yAngle') + 'deg);';
  }
});

Template.Cloud.helpers({
  layers: function() {
    return world.Layers.find({
      cloudId: this._id
    });
  },

  style: function() {
    return 'transform: translate3d(' + this.x + 'px,' + this.y + 'px,' + this.z + 'px);';
  }
});

Template.Layer.helpers({
  style: function() {
    return 'transform: translateX( ' + this.x + 'px ) translateY( ' + this.y + 'px ) translateZ( ' + this.z + 'px ) rotateY( ' + (-world.get('yAngle')) + 'deg ) rotateX( ' + (-world.get('xAngle')) + 'deg ) rotateZ( ' + this.a + 'deg ) scale( ' + this.s + ')';
  }
});