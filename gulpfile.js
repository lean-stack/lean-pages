// Lean Pages Build System

var gulp = require('gulp');

// Configuration

var cfg = {
  srcdir:   'src',
  tmpdir:   '.tmp',
  bowerdir: 'bower_components'
};

// Task Plugins
var runSeq  = require('run-sequence');
var wiredep = require('wiredep').stream;
var jade    = require('gulp-jade');
var connect = require('gulp-connect');

gulp.task('wiredep', function(){
  return gulp.src(cfg.srcdir + '/index.jade')
    .pipe(wiredep({ignorePath: '../' + cfg.bowerdir }))
    .pipe(gulp.dest(cfg.srcdir));
});

gulp.task('jade', function(){
  return gulp.src(cfg.srcdir + '/**/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(cfg.tmpdir))
    .pipe(connect.reload());
});

gulp.task('build:dev', function(cb){
  runSeq('wiredep', ['jade'], cb);
});

gulp.task('connect:dev', ['build:dev'], function () {
  connect.server({
    root: [cfg.tmpdir, cfg.bowerdir],
    port: 8008,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch('bower.json', ['build:dev']);
  gulp.watch([cfg.srcdir + '/**/*.jade'], ['jade']);
});

gulp.task('dev', ['connect:dev', 'watch']);
