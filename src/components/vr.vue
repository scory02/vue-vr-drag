<template>
    <div class="viewer" id="vr"></div>
</template>

<script>
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";
export default {
    name: 'vrV',
    data() {
        return {
            viewer: null,
            markersPlugin: null,
        }
    },
    mounted() {
        this.createMarker()
    },
    methods: {
        createMarker() {
            this.viewer = new Viewer({
                container: 'vr',
                panorama: 'https://seevr.oss-cn-beijing.aliyuncs.com/SZXC/Image/vr.jpg',
                loadingTxt: "正在加载",
                maxFov: 60,
                defaultZoomLvl: 0,
                defaultLong: 0,
                defaultLat: -Math.PI / 3,
                autorotateLat: "-0.4",
                autorotateDelay: 1000,
                autorotateSpeed: "0.4rpm",
                navbar: null,
                size: {
                    width: '100%',
                    height: '100%',
                },
                plugins: [
                    [
                        MarkersPlugin,
                        {
                            markers: []
                        }
                    ]
                ],
            });
            this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);
            // 加载完成再去请求markers
            this.viewer.once('ready', () => {
                this.markersPlugin.showAllTooltips();
            });
        },
    },
    beforeDestroy() {
        if (this.viewer) {
            this.viewer.destroy()
        }
    }
}
</script>

<style >
.viewer .psv-canvas-container {
    width: 100%;
    height: 100%;
}

.psv-canvas {
    width: 100% !important;
    height: 100% !important;
}
</style>