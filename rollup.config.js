import babel from 'rollup-plugin-babel'

const license = `/*!
    * drag-controls
    * https://github.com/jbyte/three-dragcontrols
    * (c) 2018 @jbyte
    * Released under the MIT License.
    */`

export default {
    input: "src/drag-controls.js",
    plugins: [
        babel({
            exclude: "node_modules/**",
            presets: [
                ["env", {
                    targets: {
                        browsers: [
                            "last 2 versions",
                            "ie >= 11"
                        ]
                    },
                    loose: true,
                    modules: false
                }]
            ]
        })
    ],
    output: [{
        format: "umd",
        moduleName: "DragControls",
        file: "dist/drag-controls.js",
        name: "DragControls",
        banner: license
    },
    {
        format: "es",
        file: "dist/drag-controls.module.js",
        banner: license
    }]
};
