const Widget = require('./Widget');

class RadialBar extends mix(fabric.Group).with(Widget) {
  constructor(render, data, res) {
    super(render, data);
    this.type = 'radial';

    this.progressImage = new fabric.Image();
    this.standImage = new fabric.Image();
    this.progressImage.setOriginToCenter();
    this.add([this.standImage, this.progressImage]);

    if(data.value) this.setVarible(data.value);
    else this.setValue(25);

    this.setStartAngle(-90);
    this.setMaxValue(data.max_value || 100);

    this.setProgressImage(res[this.id + ':bar'] || 'assets/white_pixel.png');
    this.setProgressColor(data.bar_color || '#ded2f7');

    this.setStandImage(res[this.id + ':stand'] || 'assets/white_pixel.png');
    this.setStandColor(data.stand_color || '#fff');

    this.setBorder(data.border_size || 0, data.border_color || '#fff');
    this.setControlsVisibility({
       mt: false,
       mb: false,
       ml: false,
       mr: false
    });
  }
  getData() {
    return {
      images: {
        [this.id + ':stand']: this.standImage._element.src,
        [this.id + ':bar']: this.progressImage._element.src
      },
      data: {
        ...this.getBasicData(),
        value: this.varible || '',
        max_value: +this.maxValue + 0.0000001,
        start_angle: 0,
        direction: 0,
        stand_color: this.standColor,
        bar_color: this.progressColor
      }
    }
  }
  setSize(w) {
    this.width = w;
    this.height = w;
    this.progressImage.top = 0;
    this.progressImage.left = 0;
    this.progressImage.width = this.width;
    this.progressImage.height = this.width;
    this.setBorder(this.borderSize, this.borderColor);
    this.setValue(this.value);
  }
  setVarible(id) {
    this.varible = id;
    this.setValue(this.render.getValueFromVarible(id));
  }
  setAngle(angle) {
    this.view.angle = angle;
    this.render.canvas.renderAll();
  }
  setProgressImage(img) {
    this.progressImage.setElement(img);
    this.setSize(this.width);
    this.setStartAngle(this.startAngle);
    this.setProgressColor(this.progressColor);
    this.setValue(this.value);
    this.render.renderAll();
  }
  setStandImage(img) {
    this.standImage.setElement(img);
    this.setSize(this.width);
    this.setStandColor(this.standColor);
    this.render.renderAll();
  }
  setStartAngle(angle) {
    this.startAngle = angle;
    this.progressImage.angle = angle;
    this.render.renderAll();
  }
  setValue(v) {
    this.value = v;
    this.progressImage.set({
      clipTo: (ctx) => {
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, this.view.width/2, 0, Math.PI*2/this.maxValue*this.value, false);
        ctx.lineTo(0, 0);
        ctx.fill();
      }
    });
    this.render.renderAll();
  }
  setMaxValue(max) {
    this.maxValue = max;
    this.setValue(this.value);
  }
  setProgressColor(color) {
    this.progressColor = color;
    this.progressImage.filters[0] = new fabric.Image.filters.Tint({color});
    this.progressImage.applyFilters(() => this.render.renderAll());
  }
  setStandColor(color) {
    this.standColor = color;
    this.standImage.filters[0] = new fabric.Image.filters.Tint({color});
    this.standImage.applyFilters(() => this.render.renderAll());
  }
}

module.exports = RadialBar;
