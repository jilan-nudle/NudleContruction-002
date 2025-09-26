export default class ZoomInMarker{
    constructor(radius, parent, scene){
        this.parent = parent
        this.circle = BABYLON.MeshBuilder.CreateDisc("circle", {radius: radius, tessellation: 64}, scene); 
        //this.circle.parent = parent;
        this.circle.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        this.scene = scene;

    }

    linkMesh(offsetCoords){
        //this.circle.position = this.circle.position.add(offsetCoords);
        this.circle.position = offsetCoords;
        this.circle.position = copyFrom(this.parent.getAbsolutePosition());

    }

    setVideo(video){
        const videoMat = new BABYLON.StandardMaterial("videoMat", this.scene);
        const videoTexture = new BABYLON.VideoTexture(
            "videoTex",              // name
            [video],           // video source (array allows multiple formats, e.g. .mp4 + .webm)
            this.scene,
            true,                    // generate mipmaps
            true,                    // invert Y
            BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE,
            { autoPlay: true, loop: true, muted: true } // video settings
        );

        videoMat.diffuseTexture = videoTexture;

        this.circle.material = videoMat;
    }

    dispose(){
        this.circle.dispose()
    }

}