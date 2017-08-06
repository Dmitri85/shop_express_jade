module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            client: {
                files: { src: ['public/**/*.js'] },
                options: {
                    loopfunc: true
                }
            },
            sever: {
                files: { src: ['routes/**/*.js' , 'model/**/*.js'] }
            }
        }
    });

    //active jshint
    grunt.loadNpmTasks('grunt-contrib-jshint');
};