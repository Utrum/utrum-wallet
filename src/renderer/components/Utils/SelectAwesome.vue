<template>
    <select name="sources" id="sources" class="custom-select sources">
        <option v-for="fee in fees" v-bind:key="fee.id" :value="fee.value">{{fee.label}}</option>
    </select>
</template>

<script>
export default {
    name: 'select-awesome',
    props: {
        fees: {
            type: Array,
            default: () => ({})
        }
    },
    data() {
      return {
          selectedLabel: '',
      }
    },
    computed: {
      selectedFee() {
        return this.fees.find((e) => e.label == this.selectedLabel)
      },
    },
    mounted() {
      var self = this;
      this.value = "test";

      $(".custom-select").each(function() {
        var classes = $(this).attr("class"),
            id      = $(this).attr("id"),
            name    = $(this).attr("name");
        var template =  '<div class="' + classes + '">';
            template += '<span class="custom-select-trigger">' + $(this).attr("value") + '</span>';
            template += '<div class="custom-options">';
        $(this).find("option").each(function() {
            template += '<span class="custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
        template += '</div></div>';
        $(this).change(function(e) {
          console.log(e)
        })
        $(this).wrap('<div class="custom-select-wrapper"></div>');
        $(this).hide();
        $(this).after(template);
      });
      $(".custom-option:first-of-type").hover(function() {
        $(this).parents(".custom-options").addClass("option-hover");
      }, function() {
        $(this).parents(".custom-options").removeClass("option-hover");
      });
      $(".custom-select-trigger").on("click", function() {
        $('html').one('click',function() {
          $(".custom-select").removeClass("opened");
        });
        $(this).parents(".custom-select").toggleClass("opened");
          event.stopPropagation();
      });
      $(".custom-option").on("click", function() {
        $(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
        $(this).parents(".custom-options").find(".custom-option").removeClass("selection");
        $(this).addClass("selection");
        $(this).parents(".custom-select").removeClass("opened");
        $(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());
        self.selectedLabel = $(this)[0].innerHTML
        self.$emit('change', self.selectedFee)
      });
    }
}
</script>

<style>

.custom-select {
    width: 100%;
    height: 0;
    padding: 0;
    line-height: 0;
    color: #fff;
    vertical-align: inherit;
    background: #fff;
    background-size: 0;
    border:0;
}

/** Custom Select **/
.custom-select-wrapper {
  position: relative;
  display: inline-block;
  user-select: none;
}
  .custom-select-wrapper select {
    display: none;
  }
  .custom-select {
    position: relative;
    display: inline-block;

  }
    .custom-select-trigger {
      position: relative;
      text-align: left;
      display: block;
      width: 100%;
      height: 30px;
      padding: 0 20px 0 0px;
      font-size: 22px;
      font-weight: 300;
      color: #180d39;
      line-height: 30px;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
    }
      .custom-select-trigger:after {
        position: absolute;
        display: block;
        content: '';
        width: 10px; height: 10px;
        top: 50%; right: 0px;
        margin-top: -3px;
        border-bottom: 1px solid #180d39;
        border-right: 1px solid #180d39;
        transform: rotate(45deg) translateY(-50%);
        transition: all .4s ease-in-out;
        transform-origin: 50% 0;
      }
      .custom-select.opened .custom-select-trigger:after {
        margin-top: 3px;
        transform: rotate(-135deg) translateY(-50%);
      }
  .custom-options {
    position: absolute;
    display: block;
    top: 100%; left: 0; right: 0;
    min-width: 100%;
    margin: 15px 0;
    border: 1px solid #b5b5b5;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 10;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
    border: none;
    background: #fff;
    transition: all .4s ease-in-out;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-15px);
  }
  .custom-select.opened .custom-options {
    opacity: 1;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
    border-radius: 4px;
    border: none;
    z-index: 10;
    visibility: visible;
    pointer-events: all;
    top: 20px;
    background-color: white;
    transform: translateY(0);
  }
    .custom-options:before {
      position: absolute;
      display: none;
      content: '';
      bottom: 100%;
      top: -4px; 
      right: 25px;
      width: 7px; 
      height: 7px;
      margin-bottom: -4px;
      border-top: 1px solid #751e1e;
      border-left: 1px solid #b5b5b5;
      background: #fff;
      transform: rotate(45deg);
      transition: all .4s ease-in-out;
    }
    .option-hover:before {
      background: #f9f9f9;
    }
    .custom-option {
      position: relative;
      display: block;
      padding: 0 0px;
      margin-left: 20px;
      margin-right: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-inline-end: 1px;
      font-size: 18px;
      font-weight: 400;
      color:#180d39;
      line-height: 47px;
      cursor: pointer;
      transition: all .4s ease-in-out;
      text-align: left !important; 
    }
    .custom-option:hover,
    .custom-option.selection {
      background: white;
    }
</style>
