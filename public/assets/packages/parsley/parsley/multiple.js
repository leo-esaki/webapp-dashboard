define('parsley/multiple', [
], function () {
  var ParsleyMultiple = function () {
    this.__class__ = 'ParsleyFieldMultiple';
  };

  ParsleyMultiple.prototype = {
    // Add new `$element` sibling for multiple field
    addElement: function ($element) {
      this.$elements.push($element);

      return this;
    },

    // See `ParsleyField.refreshConstraints()`
    refreshConstraints: function () {
      var fieldConstraints;

      this.constraints = [];

      // Select multiple special treatment
      if (this.$element.is('select')) {
        this.actualizeOptions()._bindConstraints();

        return this;
      }

      // Gather all constraints for each input in the multiple group
      for (var i = 0; i < this.$elements.length; i++) {
        fieldConstraints = this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints;

        for (var j = 0; j < fieldConstraints.length; j++)
          this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
      }

      return this;
    },

    // See `ParsleyField.getValue()`
    getValue: function () {
      // Value could be overriden in DOM
      if ('undefined' !== typeof this.options.value)
        return this.options.value;

      // Radio input case
      if (this.$element.is('input[type=radio]'))
        return $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';

      // checkbox input case
      if (this.$element.is('input[type=checkbox]')) {
        var values = [];

        $('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function () {
          values.push($(this).val());
        });

        return values.length ? values : [];
      }

      // Select multiple case
      if (this.$element.is('select') && null === this.$element.val())
        return [];

      // Default case that should never happen
      return this.$element.val();
    },

    _init: function (multiple) {
      this.$elements = [this.$element];
      this.options.multiple = multiple;

      return this;
    }
  };

  return ParsleyMultiple;
});