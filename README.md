# oneplace-clouds

This is a demo for https://github.com/yasinuslu/oneplace

Implemented using this tutorial: http://www.clicktorelease.com/blog/how-to-make-clouds-with-css-3d

Demo: http://oneclouds.meteor.com/

I think we could develop a game engine based on meteor's tracker that will re-render objects based on reactive data sources (preferably to canvas using webgl). Instead of re-rendering everything on game loop we'll just re-render changed objects. Every object will have a reactive dictionary and a render function that produces a sprite.

This is a tiny experiment to see if it will work or not.
