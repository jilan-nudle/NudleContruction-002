import SceneObject from "./SceneObject.js";
import TopMenu from "./TopMenu.js";
import DialogScreen from "./DialogScreen.js";
import XRChangeManager from "./XRChangeManager.js";
import BlobShadow from "./BlobShadow.js";
import BaseState from "./FlowEngine/BaseState.js";
import FlowEngine from "./FlowEngine/FlowEngine.js";


var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };


// States
class IntroScene extends BaseState {
    constructor() {
        super('Introduction');
        this.rootLayout = null;
    }

    async enter(engine) {

        const introScreen = new DialogScreen("assets/media/overview-image.png", "Roof Construction", "This lesson introduces learners to the basic elements of timber roof construction. It focuses on the essential components — trusses, wall plates, roof anchors, purlins, and battens — and explains their functions in simple, practical terms.", "START LESSON");

        introScreen.attachEvent(() => {
            engine.goTo("Overview");
        });

        this.introScreenObj = introScreen.get();

        engine.context.advancedTexture.addControl(this.introScreenObj);

        const xrManager = new XRChangeManager(engine.context.xr);
        xrManager.inAR = () => {
            introScreen.setScale(3);
        }
        xrManager.onExitAR = () => {
            introScreen.setScale(1);
        }

        xrManager.processCheck();


    }

    async exit() {
        this.introScreenObj.dispose();
    }
}

class OverviewScene extends BaseState {
    constructor() {
        super('Overview');
    }

    async enter(engine, payload) {

        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.setCaption("A roof truss is a large triangular wooden frame forming the roof’s skeleton, supporting coverings like tiles against loads from rain and wind. In South Africa, timber trusses are most common since wood is cheaper and easier to work with than steel.");
        engine.context.topMenu.maximizeCaption();

        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 20, 30);

        // Playing the animation.
        engine.context.mainObject.refresh();
        engine.context.mainObject.playAnimation("Animation", false, 1, 0, 410);


        const xrManager = new XRChangeManager(engine.context.xr);

        xrManager.inAR = () => {
            engine.context.isARPlaced = true;

            engine.context.topMenu.setScale(3);

            const object = engine.context.mainObject;

            engine.context.dot.isVisible = false;

            object.getRoot().parent = engine.context.root;
            object.setVisible(true);
            object.getRoot().position.set(0, 0, 0);

            //object.setScaling(1);
            engine.context.root.scaling = new BABYLON.Vector3(1, 1, 1);


            // changing topmenu icon
            engine.context.topMenu.arButton.image.source = "https://i.imgur.com/fUOPUfW.png";

        }

        xrManager.in3D = () => {
            engine.context.skybox.isVisible = true;

            // Scaling UI
            engine.context.topMenu.setScale(1);

            const object = engine.context.mainObject;
            object.setVisible(true);
            engine.context.root.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);


            // changing topmenu icon
            engine.context.topMenu.arButton.image.source = "https://i.imgur.com/ugjxybx.png";

        }

        xrManager.onExitAR = () => {
            engine.context.isARPlaced = false;
        }


        xrManager.processCheck();


    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);
        
    }
}

class Slide1Scene extends BaseState {
    constructor() {
        super("Slide1");
    }

    async enter(engine) {
        // setting up top menu
        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.maximizeCaption();
        engine.context.mainObject.setVisible(true);

        // setting camera angle
        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 0, 30);


        // setting text and playing animation
        engine.context.topMenu.setCaption("Bolts fasten timber pieces firmly, but they must use thick washers to prevent the wood from being crushed or split. Nail plates, on the other hand, are thin steel sheets with sharp teeth that grip the timber and spread the load more evenly, creating joints stronger than bolts.");
        engine.context.mainObject.playAnimation("Animation", false, 1, 410, 462);


    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);
    }

}

class Slide2Scene extends BaseState {
    constructor() {
        super("Slide2");
    }

    async enter(engine) {
        // setting up top menu
        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.maximizeCaption();
        engine.context.mainObject.setVisible(true);

        // setting camera angle
        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 35, 30);


        // setting text and playing animation
        engine.context.topMenu.setCaption("When trusses are built with nail plates in factories, they are safer, stronger, and much faster to install on site. This prefabrication process ensures better quality control and efficiency compared to building directly on location.");
        engine.context.mainObject.playAnimation("Animation", false, 1, 500, 600);

    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);
    }

}

class Slide3Scene extends BaseState {
    constructor() {
        super("Slide3");
    }

    async enter(engine) {
        // setting up top menu
        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.maximizeCaption();
        engine.context.mainObject.setVisible(true);


        // setting camera angle
        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 35, 30);


        // setting text and playing animation
        engine.context.topMenu.setCaption("A hurricane clip is a small angled metal connector that fastens roof trusses or rafters securely to the wall plate, preventing them from being lifted by strong winds. By reinforcing the joint between roof and wall, it helps keep the entire structure stable and reduces the risk of the roof blowing off during storms.");
        engine.context.mainObject.playAnimation("Animation", false, 1, 600, 840);


        // attaching label
        var rect = new BABYLON.GUI.Rectangle();
        this.rect = rect;
        rect.height = "30px";
        rect.width = "350px";
        rect.background = "black";

        var text = new BABYLON.GUI.TextBlock();
        text.text = "Take a closer look at the blinking object";
        text.color = "white";

        rect.addControl(text);

        engine.context.advancedTexture.addControl(rect);
        rect.linkWithMesh(engine.context.mainObject.findMesh("Wall"));

        // hightlighting object
        const connector = engine.context.mainObject.findMesh("Connecter");
        this.connector = connector;
        this.originalMat = connector.material;

        var mat = new BABYLON.StandardMaterial("mat", engine.context.scene);
        mat.emissiveColor = new BABYLON.Color3(0.72, 0.25, 0.62); // neon green
        connector.material = mat;

        var gl = new BABYLON.GlowLayer("glow", engine.context.scene);
        gl.intensity = 0.8;  // adjust brightness

        // Blink animation
        let toggle = true;

        this.myInterval = setInterval(() => {
            toggle = !toggle;
            gl.isEnabled = toggle;
            if(toggle){
                connector.material = mat;
            }else{
                connector.material = this.originalMat;
            }
        }, 1000); // blink every 500ms


    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        this.connector.material = this.originalMat;
        clearInterval(this.myInterval);
        this.rect.dispose();



    }

}

class Slide4Scene extends BaseState {
    constructor() {
        super("Slide4");
    }

    async enter(engine) {
        // setting up top menu
        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.maximizeCaption();
        engine.context.mainObject.setVisible(true);

        // setting camera angle
        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 35, 30);


        // setting text and playing animation
        engine.context.topMenu.setCaption("Wall straps are long metal strips fixed into the wall and tied over roof trusses to hold them firmly in place. They provide extra anchorage, helping transfer the roof’s weight into the walls and preventing the trusses from lifting or shifting in strong winds or storms.");
        engine.context.mainObject.playAnimation("Animation", false, 1, 840, 1100);


        // attaching label
        var rect = new BABYLON.GUI.Rectangle();
        this.rect = rect;
        rect.height = "30px";
        rect.width = "350px";
        rect.background = "black";

        var text = new BABYLON.GUI.TextBlock();
        text.text = "Take a closer look at the blinking object";
        text.color = "white";

        rect.addControl(text);

        engine.context.advancedTexture.addControl(rect);
        rect.linkWithMesh(engine.context.mainObject.findMesh("Wall"));

        // hightlighting object
        const anchorStrap = engine.context.mainObject.findMesh("AnchorStrap");
        this.anchorStrap = anchorStrap;
        this.originalMat = anchorStrap.material;

        var mat = new BABYLON.StandardMaterial("mat", engine.context.scene);
        mat.emissiveColor = new BABYLON.Color3(0.72, 0.25, 0.62); // neon green
        anchorStrap.material = mat;

        var gl = new BABYLON.GlowLayer("glow", engine.context.scene);
        gl.intensity = 0.8;  // adjust brightness

        // Blink animation
        let toggle = true;

        this.myInterval = setInterval(() => {
            toggle = !toggle;
            gl.isEnabled = toggle;
            if(toggle){
                anchorStrap.material = mat;
            }else{
                anchorStrap.material = this.originalMat;
            }
        }, 1000); // blink every 500ms

    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        this.anchorStrap.material = this.originalMat;
        clearInterval(this.myInterval);
        this.rect.dispose();
    }

}

class Slide5Scene extends BaseState {
    constructor() {
        super("Slide5");
    }

    async enter(engine) {
        // setting up top menu
        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.maximizeCaption();
        engine.context.mainObject.setVisible(true);

        // setting up camera angle
        engine.context.mainObject.faceCameraByMesh("topplank.001", engine.context.scene.activeCamera, 90, 60);


        // setting text and playing animation
        engine.context.topMenu.setCaption("Purlins and battens are long timber or steel strips fixed horizontally across the rafters, creating the surface where roof tiles or sheets are secured. They distribute the weight of the covering evenly and provide the support needed to keep the roof stable.");
        engine.context.mainObject.playAnimation("Animation", false, 1, 1100, 1700);

    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);
    }

}




class ArIntroScene extends BaseState {
    constructor() {
        super('ArIntroduction')
    }

    async enter(engine) {
        engine.context.skybox.isVisible = false;

        engine.context.dot.isVisible = true;
        engine.context.hitTest.onHitTestResultObservable.add((results) => {
            if (engine.context.isARPlaced == false) {
                if (results.length) {
                    engine.context.dot.isVisible = true;
                    results[0].transformationMatrix.decompose(engine.context.dot.scaling, engine.context.dot.rotationQuaternion, engine.context.dot.position);
                    results[0].transformationMatrix.decompose(undefined, engine.context.root.rotationQuaternion, engine.context.root.position);
                } else {
                    engine.context.dot.isVisible = false;
                }
            }
        });

    }

    async exit(engine) {

    }

}


class ConcludeScene extends BaseState {
    constructor() {
        super('Conclusion');
        this.rootLayout = null;
    }

    async enter(engine) {
        const endScreen = new DialogScreen("assets/media/overview-image.png", "Roof Construction", "By the end of this lesson, learners should be able to:\n- Define a roof truss and name key parts (rafter, tie beam, king post).\n- Explain how wall plates spread truss loads.\n- Describe roof anchors securing trusses to masonry.\n- Identify purlins and battens supporting roof coverings.\n- Note that bracing exists (covered later).", "END LESSON");

        endScreen.attachEvent(() => {
            window.location.href = window.location.href;
        });

        this.endScreenObj = endScreen.get();

        engine.context.advancedTexture.addControl(this.endScreenObj);

        const xrManager = new XRChangeManager(engine.context.xr);
        xrManager.inAR = () => {
            endScreen.setScale(3);
        }
        xrManager.onExitAR = () => {
            endScreen.setScale(1);
        }

        xrManager.processCheck();

    }

    async exit() {
        this.endScreenObj.dispose();
    }
}



var createScene = async function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    var camera = new BABYLON.ArcRotateCamera("camera1", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 3;

    const xrButton = document.querySelector(".xr-button-overlay");
    if (xrButton)
        xrButton.style.position = "";


    // GLOBAL VALUES


    // GLOBAL COMPONENTS
    const ADVANCEDTEXTURE = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    const XR = await scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
            sessionMode: "immersive-ar",
            disableDefaultUI: true,
        },
    });


    const ROOT = new BABYLON.TransformNode("ParentNode", scene);

    const TOPMENU = new TopMenu(ADVANCEDTEXTURE);
    TOPMENU.setVisible(false);
    // disabling additional buttons through out all the scenes
    TOPMENU.disableAdditionalButtons(true);


    const MAINOBJECT = new SceneObject("/assets/models/TrussRoofing(Animation).glb", scene);
    await MAINOBJECT.loadObject();
    MAINOBJECT.setVisible(false);
    MAINOBJECT.setParent(ROOT);
    MAINOBJECT.getRoot().rotationQuaternion = null; // resetting the rotation so the faceCameraByMesh method works fine.
    MAINOBJECT.getRoot().rotation.y = 3.2;

    // Creating the Occluder
    const OCCLUDER = BABYLON.MeshBuilder.CreatePlane("plane", { width: 15, height: 50 }, scene);
    OCCLUDER.rotation.x = Math.PI / 2; // rotating it to be horizontal.
    OCCLUDER.parent = MAINOBJECT.getRoot();
    OCCLUDER.position.y = 4;

    MAINOBJECT.attachOccluder(OCCLUDER);
    MAINOBJECT.activateOccluder(true);




    // attaching virtual shadow
    const SHADOW = new BlobShadow(scene, { radius: 1, opacity: 0 });
    SHADOW.attachTo(MAINOBJECT.getRoot());

    MAINOBJECT.refresh = () => {
        MAINOBJECT.stopAllAnimation();
    }

    // stopping main object
    MAINOBJECT.refresh();

    // Setting additonal button functions
    TOPMENU.animateButton.onPointerUpObservable.add(() => {

    });

    TOPMENU.explodeButton.onPointerUpObservable.add(() => {

    });

    // Defining pointer in main scene
    //const DOT = BABYLON.SphereBuilder.CreateSphere("dot",{diameter: 0.1,},scene);
    const DOT = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 });
    DOT.isVisible = false;
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
            const { hit, pickedMesh } = pointerInfo.pickInfo;
            if (hit && pickedMesh === DOT) {
                MANAGER.goTo("Overview");
            }
        }
    });

    const FEATUREMANAGER = XR.baseExperience.featuresManager;
    const HITTEST = FEATUREMANAGER.enableFeature(BABYLON.WebXRHitTest, "latest");



    // =======
    const MANAGER = new FlowEngine({
        states: [new IntroScene(), new OverviewScene(), new Slide1Scene(), new Slide2Scene(), new Slide3Scene(), new Slide4Scene(), new Slide5Scene(), new ConcludeScene(), new ArIntroScene()],
        initial: 'Introduction',
        context: {
            advancedTexture: ADVANCEDTEXTURE, topMenu: TOPMENU, xr: XR, babylonEngine: engine,
            root: ROOT, scene: scene, mainObject: MAINOBJECT, dot: DOT, shadow: SHADOW,
            skybox: skybox, featureManager: FEATUREMANAGER, hitTest: HITTEST, isARPlaced: false,
            uiScale: 1,
        }
    });


    TOPMENU.arButton.onPointerUpObservable.add(() => {
        if (XR.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            XR.baseExperience.exitXRAsync();
        } else if (XR.baseExperience.state === BABYLON.WebXRState.NOT_IN_XR) {
            XR.baseExperience.enterXRAsync("immersive-ar", "local-floor");
        }
    });




    TOPMENU.nextButton.onPointerUpObservable.add(() => {
        window.speechSynthesis.cancel();
        const current = MANAGER.current?.name;
        const stateNames = Array.from(MANAGER.states.keys());
        let index = stateNames.indexOf(current);
        if (index >= 0 && index < stateNames.length - 1) {
            MANAGER.goTo(stateNames[index + 1]);
        }
    });

    TOPMENU.prevButton.onPointerUpObservable.add(() => {
        window.speechSynthesis.cancel();
        const current = MANAGER.current?.name;
        const stateNames = Array.from(MANAGER.states.keys());
        let index = stateNames.indexOf(current);
        if (index >= 1 && index < stateNames.length) {
            MANAGER.goTo(stateNames[index - 1]);
        }

    });


    // Handling XR changes
    XR.baseExperience.onStateChangedObservable.add((state) => {
        if (state === BABYLON.WebXRState.IN_XR) {
            MANAGER.goTo("ArIntroduction"); // restarting scene
        } else if (state === BABYLON.WebXRState.NOT_IN_XR) {
            MANAGER.goTo("Overview"); // restarting scene
        }
    });


    // MAIN
    await MANAGER.start();

    // delete me
    //scene.debugLayer.show();



    return scene;
};

window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }


    // Fixing JS module glitch.
    engine = await asyncEngineCreation();
    window.engine = window;

    const engineOptions = window.engine.getCreationOptions?.();
    if (!engineOptions || engineOptions.audioEngine !== false) {

    }
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);

    // Fixing JS module glitch.
    scene = createScene();
    window.scene = scene;
};
initFunction().then(() => {
    scene.then(returnedScene => { sceneToRender = returnedScene; });

});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});