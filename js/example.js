import Matter from "matter-js";

const VIEW = {};
VIEW.SAFE_WIDTH = 400;
VIEW.SAFE_HEIGHT = 400;
VIEW.scale = Math.min(window.innerWidth / VIEW.SAFE_WIDTH, window.innerHeight / VIEW.SAFE_HEIGHT);
VIEW.width = window.innerWidth / VIEW.scale;
VIEW.height = window.innerHeight / VIEW.scale;
VIEW.centerX = VIEW.width / 2;
VIEW.centerY = VIEW.height / 2;
VIEW.offsetX = (VIEW.width - VIEW.SAFE_WIDTH) / 2 / VIEW.scale;
VIEW.offsetY = (VIEW.height - VIEW.SAFE_HEIGHT) / 2 / VIEW.scale;

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

const state = {
  allBlocks: [],
  allBodies: [],
};

const createNewBlock = () => {
  const node = document.createElement("div");
  const text = document.createElement("span");
  node.className = "block ball";
  node.style = `position: absolute; left: ${Math.random()*1000}px`;
  text.innerHTML = "哈";
  node.appendChild(text);
  return node;
}

const animate = () => {
  state.allBlocks.forEach((block) => {
    const body = state.allBodies.find((b) => b.id == block.id);
    if (!!body) {
      const x = body.position.x * VIEW.scale - block.offsetWidth/2;
      const y = body.position.y * VIEW.scale - block.offsetHeight/2;
      block.style.left = '';
      block.style.transform = `translate(${x}px, ${y}px)`;
      const text = block.firstChild;
      text.style.transform = `rotate(${body.angle}rad)`;
    }
  });

  window.requestAnimationFrame(animate);
}

const initRender = () => {
  const engine = Engine.create({
    render: {
      element: document.getElementById("canvas-container"),
      options: {
        width: VIEW.width,
        height: VIEW.height,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: true,
        enabled: true,
        wireframes: false,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: true,
        showVelocity: false,
        showCollisions: true,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: true
      }
    }
  });

  const bound = [
    Bodies.rectangle(VIEW.centerX, VIEW.height-5, VIEW.width, 10, { isStatic: true }),
    Bodies.rectangle(5, VIEW.centerY, 10, VIEW.height, { isStatic: true }),
    Bodies.rectangle(VIEW.width-5, VIEW.centerY, 10, VIEW.height, { isStatic: true }),
  ];

  World.add(engine.world, bound);
  Engine.run(engine);

  const stack = Matter.Composites.stack();
  World.add(engine.world, stack);

  const updateBlocks = (blocks) => {
    const bodies = [];
    blocks.forEach((block) => {
      const width = block.offsetWidth/VIEW.scale;
      const height = block.offsetHeight/VIEW.scale;
      const body = Bodies.circle(
        block.offsetLeft/VIEW.scale + width/2,
        height/2,
        width/2,
        {
          restitution: Math.random(),
          velocity: Matter.Vector.create(10-Math.random()*20, 0),
        }
      );
      Matter.Body.setVelocity(body, Matter.Vector.create(10-Math.random()*20, 0));
      block.id = body.id;
      state.allBlocks.push(block);
      state.allBodies.push(body);
      bodies.push(body);
    });
    Matter.Composite.add(stack, bodies);
  };

  updateBlocks([...document.querySelectorAll(".block")]);

  setInterval(() => {
    const nodes = [];
    const num = parseInt(Math.random()*5);
    for (let i=0; i<num; i++) {
      const node = createNewBlock();
      document.getElementById("container").appendChild(node);
      nodes.push(node);
    }
    updateBlocks(nodes);
  }, 1000+Math.random()*2000);

  animate();
};

document.addEventListener("DOMContentLoaded", (e) => {
  const container = document.getElementById("container");
  container.appendChild(createNewBlock());
  container.appendChild(createNewBlock());
  container.appendChild(createNewBlock());
  initRender();
});
