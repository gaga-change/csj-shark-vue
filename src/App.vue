<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
.el-card__header {
  padding: 9px 10px;
}
.el-card__body {
  padding: 10px;
}
.link_dom {
  color: rgb(51, 153, 234);
  cursor: pointer;
  &.disabled {
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
.el-button {
  font-size: 12px;
}
.simpleCard {
  padding-bottom: 0;
  margin-bottom: 20px;
  box-shadow: 0 !important;
  .el-form-item {
    margin-bottom: 10px;
    .el-input {
      max-width: 200px;
    }
  }
  .simpleCardLastLine {
    margin-bottom: 0;
  }
}

// 按钮连接
.btn-link {
  color: rgb(51, 153, 234);
  background-color: initial !important;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0;
  border: none;
  margin: 0;

  &[disabled="disabled"] {
    color: #c0c4cc !important;
    cursor: not-allowed !important;
  }
  &:hover {
    color: rgb(3, 138, 248);
  }
}

// 非当前项目专属的公共样式。即使拷贝到其他项目也能使用。
// 公共样式  字体大小  字重  padding

.c-333 {
  color: #333;
}

.c-666 {
  color: #666;
}
.c-ccc {
  color: #ccc;
}

//  字体大小。 如： f12、f26
$fontSizeList: 12 14 16 18 20 22 24 26 28;

@each $var in $fontSizeList {
  .f#{$var} {
    font-size: #{$var}px;
  }
}

// 字重。如: fw600
$fontWeightList: 400 500 600 700;

@each $var in $fontWeightList {
  .fw#{$var} {
    font-weight: #{$var};
  }
}

// margin。如: mt20（margin-top:20px;）、ml15(margin-left:15)
$dirList: "l" "r" "t" "b";
$dirMap: (
  "l": "left",
  "r": "right",
  "t": "top",
  "b": "bottom"
);

$dirSizeList: 5 10 15 20 25;

@each $dir in $dirList {
  @each $size in $dirSizeList {
    .m#{$dir}#{$size} {
      margin-#{map-get($dirMap, $dir)}: #{$size}px;
    }
  }
}

.text-center {
  text-align: center;
}

.clearfix {
  &::after {
    content: "";
    clear: both;
  }
}
</style>

