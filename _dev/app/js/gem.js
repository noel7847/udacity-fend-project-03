/**
 * @fileOverview Gem-specific code
 * @author Noel Noche
 * @version 3.0.0
 */

// Holds the gem instance produced by initialize_objects
// Shared with engine.js
var gemInstance = null;

// Ensures one gem at a time appears
var activeGem = false;

// For generating a randomly weighted gem type
var gemMetadata = [{
  name: 'gem-blue',
  weight: 0.500
}, {
  name: 'gem-green',
  weight: 0.350
}, {
  name: 'gem-orange',
  weight: 0.25
}, {
  name: 'heart',
  weight: 0.1
}];

var weightedGemList = RandTools.make_weighted(gemMetadata);

// Used to keep track of gem positions so they won't appear 
// in a position occupied by a finished character
var gemCols = [0, 101, 202, 303, 404];


// Using pseudo-classical inheritance for creating each gem type
// There are 4 types: blue, green, orange and the life heart
var Gem = function(sprite) {
  this.name = null;
  this.sprite = null;
  this.x = null;
  this.y = null;
  this.w = 101;
  this.h = 171;
  this.points = null;
  this.bonusLife = false;
  this.taken = false;
};
Gem.prototype = {
  checkPlayerGet: function(player) {
    if (this.x === player.x && this.y === player.y) {
      this.taken = true;
      
      if (this.name === 'heart') {
        this.bonusLife = true;
      }
    }
  },

  update: function() {
    if (this.taken) {
      
      if (soundOn) {
        playSound('start');
      }
      
      if (this.bonusLife) {
        addHeart();
      } else {
        score += this.points;
        $scoreNode.text(score);
      }
      
      this.activeTimer = false;
      this.taken = false;
      this.sprite = '';
      activeGem = false;
    }
  },
  
  render: function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};


function generateGem() {
  var randIndex = RandTools.gen_rand_index(weightedGemList.length - 1, 0);
  var weightedGem = weightedGemList[randIndex];
  var xPos = gemCols[RandTools.gen_rand_index(4, 0)];
  var yPos = ROWS[0];
  var gemComponents = [Behaviors.set_timer];
  var gem = new Gem();
  
  gem.name = weightedGem;
  gem.x = xPos;
  gem.y = yPos;

  switch (gem.name) {
    case 'gem-blue':
      gem.sprite = 'assets/images/gem-blue.png';
      gem.points = 5;
      break;
    case 'gem-green':
      gem.sprite = 'assets/images/gem-green.png';
      gem.points = 10;
      break;
    case 'gem-orange':
      gem.sprite = 'assets/images/gem-orange.png';
      gem.points = 15;
      break;
    case 'heart':
      gem.sprite = 'assets/images/heart.png';
      gem.bonusLife = true;
      break;
  }
  
  Behaviors.add_behaviors(gem, gemComponents);
  
  return gem;
}
