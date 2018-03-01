import Matter from "matter-js";
import vex from "vex-js";
import vexDialog from "vex-dialog";

import share from "./share.js";

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

const state = {
  allBodies: [],
  timer: null,
};

const messages = [
  "前幾日經過馬尿水大學",
  "見到好多IT學生一車車咁送入去",
  "有好多個仲流緊眼淚",
  "佢地知呢一世都會俾人呼喚去整電腦...",
  "真係好慘！",
  "IT人係有靈性",
  "推動社會科技發展",
  "請大家唔好以為所有IT人都係幫你整電腦！",
  "我都已經開始戒...😇"
];

vex.registerPlugin(vexDialog);
vex.defaultOptions.className = "vex-theme-wireframe";

const createMessage = (msg) => {
  return `<div class="prompt-message">${msg}</div>`;
}

const promptMessage = (index = 0) => {
  if (index < messages.length) {
    const dialog = vex.open({
      unsafeContent: createMessage(messages[index]),
      showCloseButton: false,
      escapeButtonCloses: false,
      overlayClosesOnClick: false,
      closeAllOnPopState: false,
    });
    document.body.removeChild(dialog.overlayEl);
    setTimeout(() => {
      promptMessage(index+1);
    }, 5000);
    setTimeout(() => {
      dialog.close();
    }, 6000);
  } else {
    
    const dialog = vex.open({
      unsafeContent: share.join(""),
      showCloseButton: false,
      escapeButtonCloses: false,
      overlayClosesOnClick: false,
      closeAllOnPopState: false,
    });
    document.body.removeChild(dialog.overlayEl);

    const link = document.getElementById("link");
    link.setAttribute("value", window.location);
    link.addEventListener("click", function(e) {
      this.setSelectionRange(0, this.value.length);
    });
  }
}

const initRender = () => {
  const engine = Engine.create({
    render: {
      element: document.getElementById("canvas-container"),
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: true,
        enabled: true,
        wireframes: false,
        showSleeping: false,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false
      }
    }
  });

  const bound = [
    Bodies.rectangle(window.innerWidth/2, window.innerHeight-25, window.innerWidth, 50, { isStatic: true }),
    Bodies.rectangle(25, window.innerHeight/2, 50, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(window.innerWidth-25, window.innerHeight/2, 50, window.innerHeight, { isStatic: true }),
  ];

  World.add(engine.world, bound);
  Engine.run(engine);

  const stack = Matter.Composites.stack();
  World.add(engine.world, stack);

  const updateBlocks = () => {
    const bodies = [];
    const num = parseInt(Math.random()*10);
    for (let i=0; i<num; i++) {
      const radius = Math.random()*50;
      const centerX = Math.random()*(window.innerWidth-2*radius);
      const ctx = document.getElementById("canvas").getContext("2d");
      const body = Bodies.circle(
        centerX + radius,
        radius,
        radius,
        {
          restitution: Math.random(),
          velocity: Matter.Vector.create(10-Math.random()*20, 0),
          render: {
            sprite: {
              texture: "images/itdog01.png",
              xScale: radius/330,
              yScale: radius/330,
            },
            opacity: 1,
          },
        }
      );
      state.allBodies.push(body);
      bodies.push(body);
    }
    Matter.Composite.add(stack, bodies);

    if (state.allBodies.length > 500) {
      clearInterval(state.timer);
    }
  };

  updateBlocks();

  state.timer = setInterval(() => updateBlocks(), Math.random()*2000);

  setTimeout(() => {
    promptMessage();
    document.getElementById("overlay").className = "overlay";
  }, 2000);
};

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.getElementById("container");
  initRender();
});
