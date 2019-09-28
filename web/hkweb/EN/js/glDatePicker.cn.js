;(function() {
	$.fn.glDatePicker = function(options) {
		var pluginName = 'glDatePicker';
		var instance = this.data(pluginName);
		// If the instance wasn't found, create it...
		if(!instance) {
			// Return the element being bound to
			return this.each(function() {
				return $(this).data(pluginName, new glDatePicker(this, options));
			});
		}
		// then return the instance of the plugin itself
		return (options === true) ? instance : this;
	};

	// Default options
	$.fn.glDatePicker.defaults = {
		cssName: 'default',
		zIndex: 1000,
		borderSize: 1,
		calendarOffset: { x: 0, y: 1 },
		showAlways: false,
		hideOnClick: true,
		allowMonthSelect: true,
		allowYearSelect: true,
		todayDate: new Date(),
		selectedDate: null,
		prevArrow: '\u25c4',
		nextArrow: '\u25ba',
		selectableDates: null,
		selectableDateRange: null,
		specialDates: null,
		selectableMonths : null,
		selectableYears: null,
		selectableDOW : null,
		monthNames: null,
		dowNames: null,
		dowOffset: 0,
		onClick: (function(el, cell, date, data) {
			el.val(date.toLocaleDateString());
		}),
		onHover: function(el, cell, date, data) {},
		onShow: function(calendar) { calendar.show(); },
		onHide: function(calendar) { calendar.hide(); },
		firstDate: null
	};

	// Our plugin object
	var glDatePicker = (function() {
		// Main entry point.  Initialize the plugin
		function glDatePicker(element, userOptions) {
			// Grab handle to this
			var self = this;

			// Save bound element to el
			self.el = $(element);
			var el = self.el;

			// Merge user options into default options
			self.options = $.extend(true, {}, $.fn.glDatePicker.defaults, userOptions);
			var options = self.options;

			// Find the calendar element if the user provided one
			self.calendar = $($.find('[gldp-el=' + el.attr('gldp-id') + ' ]'));

			// Default first date to selected
			options.selectedDate = options.selectedDate || options.todayDate;
			options.firstDate = (new Date((options.firstDate || options.selectedDate)))._first();

			if(!(el.attr('gldp-id') || '').length) {
				el.attr('gldp-id', 'gldp-' + Math.round(Math.random() * 1e10))
			}

			// Show the plugin on focus
			el.addClass('gldp-el').bind('click', function(e) { self.show(e); }).bind('focus', function(e) { self.show(e); });

			// If the user is defining the container and it exists, hide it on initial creation.
			// The update function will handle showing if it's showAlways = true
			if(self.calendar.length && !options.showAlways) {
				self.calendar.hide();
			}

			// Hide the plugin on mouse up outside of the plugin
			$(document).bind('mouseup', function(e) {
				var target = e.target;
				var calendar = self.calendar;

				if(!el.is(target) && !calendar.is(target) && calendar.has(target).length === 0 && calendar.is(':visible')) {
					self.hide();
				}
			});

			// Render calendar
			self.render();
		};

		// Public methods
		glDatePicker.prototype = {
			show: function() {
				$.each($('.gldp-el').not(this.el), function(i, o) {
					if(o.length) { o.options.onHide(o.calendar) ; }
				});
				this.options.onShow(this.calendar);
			},
			hide: function() {
				if(this.options && !this.options.showAlways) {
					this.options.onHide(this.calendar);
				}
			},
			// Render the calendar
			render: function(renderCalback) {
				var self = this;
				var el = self.el;
				var options = self.options;
				var calendar = self.calendar;

				// Build a core class (with border) that every element would have
				var coreClass = ' core border ';
				var cssName = 'gldp-' + options.cssName;

				// Get today
				var todayVal = options.todayDate._val();
				var todayTime = todayVal.time;

				// Constants
				var maxRow = 6;
				var maxCol = 7;
				var borderSize = options.borderSize + 'px';

				// Helper function to build selectable list
				var getSelectableList = function(min, max, userList) {
					// Build a default list using min/max
					var resultList = [];
					for(var i = min; i <= max; i++) { resultList.push(i); }
					// If user provided a collection, sanitize list by ensuring it's within range and unique
					if(userList) {
						var newList = [];
						$.each(userList, function(i, v) {
							if(v >= min && v <= max && newList._indexOf(v) < 0) {
								newList.push(v);
							}
						});
						resultList = newList.length ? newList : resultList;
					};

					// Sort the values before returning it
					resultList.sort();

					return resultList;
				};

				// Selectable (constants)
				var selectableMonths = getSelectableList(0, 11, options.selectableMonths);
				var selectableYears = getSelectableList(todayVal.year - 5, todayVal.year + 5, options.selectableYears);
				var selectableDOW = getSelectableList(0, 6, options.selectableDOW);
				var dowNames = options.dowNames || [ '日', '一', '二', '三', '四', '五', '六' ];
                var monthNames = options.monthNames || [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ];

				// Create cell width based on el size
				var containerWidth = el.innerWidth();
				var containerHeight = containerWidth;

				// Create cell size based on container size
				var getCellSize = function(_size, _count) {
					// return (_size / _count) + ((options.borderSize / _count) * (_count - 1));
					return (_size/_count);
				};

				var cellWidth = getCellSize(containerWidth, maxCol);
				// var cellHeight = getCellSize(containerHeight, maxRow + 2);
				var cellHeight = cellWidth;

				// If calendar doesn't exist, create it and re-assign it to self
				if(!calendar.length) {
					self.calendar = calendar = $('<div/>')
						.attr('gldp-el', el.attr('gldp-id'))
						.data('is', true)
						.css({
							display: (options.showAlways ? undefined : 'none'),
							zIndex: options.zIndex,
							width: (cellWidth * maxCol) + 'px'
						});

					$('#rootCalendar').append(calendar);
				}
				else {
					if(!eval(calendar.data('is'))) {
						containerWidth = calendar.outerWidth();
						containerHeight = calendar.outerHeight();

						cellWidth = getCellSize(containerWidth, maxCol);
						cellHeight = getCellSize(containerHeight, maxRow + 2);
					}
				}

				// Hide calendar if the target element isn't visible
				if(!el.is(':visible')) { calendar.hide(); }

				// Add core classes and remove calendar's children
				calendar.removeClass().addClass(cssName).children().remove();
				// Bind to resize event to position calendar
				var onResize = function() {
					var elPos = el.offset();
					calendar.css({
						top: (elPos.top + el.outerHeight() + options.calendarOffset.y) + 'px',
						left: (elPos.left + options.calendarOffset.x) + 'px'
					});
				};
				$(window).resize(onResize);
				onResize();

				// Create variables for cells
				var cellCSS =
				{
					width: cellWidth + 'px',
					height: cellHeight + 'px',
					lineHeight: cellHeight + 'px'
				};

				// Helper function to setDate
				var setFirstDate = function(_date) {
					if(_date) {
						// Get first date
						options.firstDate = _date;

						// Update the calendar
						self.render();
					}
				};

				var getFirstDate = function(_offset) {
					// Create start date as the first date of the month
					var _date = new Date(options.firstDate);

					// Default to no offset
					_offset = _offset || 0;

					// Find out which months are selectable
					while(true) {
						// Adjust date for month offset
						_date.setMonth(_date.getMonth() + _offset);
						_date.setDate(Math.min(1, _date._max()));

						// If not an offset, break out of the loop
						if(_offset == 0) { break; }

						// Get _date's value
						var dateVal = _date._val();

						// Get local vars
						var dateMonth = dateVal.month;
						var dateYear = dateVal.year;

						// Find the month first
						if(selectableMonths._indexOf(dateMonth) != -1) {
							// If year is in our collection, break...
							if(selectableYears._indexOf(dateYear) != -1) {
								break;
							}
							else {
								// ...otherwise, if it's out of bounds, exit loop
								if(dateYear < selectableYears[0] || dateYear > selectableYears[selectableYears.length - 1]) {
									return null;
								}
							}
						}
					}

					return _date;
				};

				// Get the previous, next first dates
				var prevFirstDate = getFirstDate(-1);
				var nextFirstDate = getFirstDate(1);

				// Get the first date for the current month being rendered
				var firstDate = (options.firstDate = getFirstDate());
				var firstDateVal = firstDate._val();
				var firstDateMonth = firstDateVal.month;
				var firstDateYear = firstDateVal.year;

				// Get the start date in the calendar
				var startDate = new Date(firstDate);

				// Sanitize days of the week offset
				var dowOffset = Math.abs(Math.min(6, Math.max(0, options.dowOffset)));

				// Offset weekdays
				var startOffset = startDate.getDay() - dowOffset;
					startOffset = startOffset < 1 ? -7 - startOffset : -startOffset;
					dowNames = (dowNames.concat(dowNames))
								.slice(dowOffset, dowOffset + 7);

				// Offset the start date
				startDate._add(startOffset);

				// Gather flags for prev/next arrows
				var showPrev = (prevFirstDate);
				var showNext = (nextFirstDate);

				// Create the arrows and title
				var monyearClass = coreClass + 'monyear ';

				var prevCell = $('<div/>')
								.addClass(monyearClass)
								.css(
									$.extend({}, cellCSS,
									{
										borderWidth: borderSize + ' 0 0 ' + borderSize
									})
								)
								.append(
									$('<a/>')
										.addClass('prev-arrow' + (showPrev ? '' : '-off'))
										.html(options.prevArrow)
								)
								.mousedown(function() { return false; })
								.click(function(e) {
									if(options.prevArrow != '' && showPrev) {
										e.stopPropagation();
										setFirstDate(prevFirstDate);
									}
								});

				var titleCellCount = maxCol - 2;
				var titleWidth = (cellWidth * titleCellCount) - (titleCellCount * options.borderSize) + (options.borderSize);
				var titleCell = $('<div/>')
								.addClass(monyearClass + 'title')
								.css(
									$.extend({}, cellCSS,
									{
										width: titleWidth + 'px',
										borderTopWidth: borderSize,
										marginLeft: '-' + (borderSize)
									})
								);

				var nextCell = $('<div/>')
								.addClass(monyearClass)
								.css(
									$.extend({}, cellCSS,
									{
										marginLeft: '-' + (borderSize),
										borderWidth: borderSize + ' ' + borderSize + ' 0 0'
									})
								)
								.append(
									$('<a/>')
										.addClass('next-arrow' + (showNext ? '' : '-off'))
										.html(options.nextArrow)
								)
								.mousedown(function() { return false; })
								.click(function(e) {
									if(options.nextArrow != '' && showNext) {
										e.stopPropagation();
										setFirstDate(nextFirstDate);
									}
								});

				// Add cells for prev/title/next
				calendar
					.append(prevCell)
					.append(titleCell)
					.append(nextCell);

				// Add all the cells to the calendar
				for(var row = 0, cellIndex = 0; row < maxRow + 1; row++) {
					for(var col = 0; col < maxCol; col++, cellIndex++) {
						var cellDate = new Date(startDate);
						var cellClass = 'day';
						var cellZIndex = options.zIndex + (cellIndex);
						var cell = $('<div/>')

						if(!row) {
							cellClass = 'dow';
							cell.html(dowNames[col]);
							cellDate = null;
						}
						else {
							// Get the new date for this cell
							cellDate._add(col + ((row - 1) * maxCol));

							// Get value for this date
							var cellDateVal = cellDate._val();
							var cellDateTime = cellDateVal.time;

							// Variable to hold special data
							var specialData = null;

							// Determine if this date is selectable
							var isSelectable = true;

							// Helper function to get repeat friendly date against current date
							var getRepeatDate = function(v, date) {
								// If repeating, set the date's year and month accordingly
								if(v.repeatYear === true) { date.setYear(cellDateVal.year); }
								if(v.repeatMonth === true) { date.setMonth(cellDateVal.month); }

								return date._val();
							};

							// Assign date for the cell
							cell.html(cellDateVal.date);

							// If we have selectable date ranges
							if(options.selectableDateRange) {
								isSelectable = false;
								$.each(options.selectableDateRange, function(i, v) {
									var dateFrom = v.from;
									var dateTo = (v.to || null);

									// If to is not specified, default to max days in the from month
									dateTo = dateTo || new Date(v.from.getFullYear(), v.from.getMonth(), v.from._max());

									// If repeating year, set the from and two to the current date's year
									dateFrom = getRepeatDate(v, dateFrom);
									dateTo = getRepeatDate(v, dateTo);

									// Test to see if this date is selectable
									if(cellDateTime >= dateFrom.time && cellDateTime <= dateTo.time) {
										isSelectable = true;
										return true;
									}
								});
							}

							// Handle date ranges and collections
							if(options.selectableDates) {
								if((options.selectableDateRange && !isSelectable) || (isSelectable && !options.selectableDateRange)) {
									isSelectable = false;
								}
								$.each(options.selectableDates, function(i, v) {
									var vDate = getRepeatDate(v, v.date);

									if(vDate.time == cellDateTime) {
										return (isSelectable = true);
									}
								});
							}

							// If not active or if not within selectableMonths, set to noday otherwise evaluate accordingly
							if(!isSelectable ||
								selectableYears._indexOf(cellDateVal.year) < 0 ||
								selectableMonths._indexOf(cellDateVal.month) < 0 ||
								selectableDOW._indexOf(cellDateVal.day) < 0) {
								cellClass = 'noday';
							}
							else {
								// Handle active dates and weekends
								cellClass = ([ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ])[cellDateVal.day];

								// Handle today or selected dates
								if(firstDateMonth != cellDateVal.month) { cellClass += ' outday'; }
								if(todayTime == cellDateTime) { cellClass = 'today'; cellZIndex += 50; }
								if(options.selectedDate._time() == cellDateTime) { cellClass = 'selected'; cellZIndex += 51; }

								// Handle special dates
								if(options.specialDates) {
									$.each(options.specialDates, function(i, v) {
										var vDate = getRepeatDate(v, v.date);

										if(vDate.time == cellDateTime) {
											cellClass = (v.cssClass || 'special');
											cellZIndex += 52;
											specialData = v.data;
										}
									});
								}

								cell
									.mousedown(function() { return false; })
									.hover(function(e) {
										e.stopPropagation();

										// Get the data from this cell
										var hoverData = $(this).data('data');

										// Call callback
										options.onHover(el, cell, hoverData.date, hoverData.data);
									})
									.click(function(e) {
										e.stopPropagation();

										// Get the data from this cell
										var clickedData = $(this).data('data');

										// Save date to selected and first
										options.selectedDate = options.firstDate = clickedData.date;

										// Update calendar (and auto-hide if necessary)
										self.render(function() {
											if(!options.showAlways && options.hideOnClick) {
												self.hide();
											}
										});

										// Call callback
										options.onClick(el, $(this), clickedData.date, clickedData.data);
									});
							}
						}

						// Update the css for the cell
						$.extend(cellCSS,
						{
							borderTopWidth: borderSize,
							borderBottomWidth: borderSize,
							borderLeftWidth: (row > 0 || (!row && !col)) ? borderSize : 0,
							borderRightWidth: (row > 0 || (!row && col == 6)) ? borderSize : 0,
							marginLeft: (col > 0) ? '-' + (borderSize) : 0,
							marginTop: (row > 0) ? '-' + (borderSize) : 0,
							zIndex: cellZIndex
						});

						// Assign other properties to the cell
						cell
							.data('data', { date: cellDate, data: specialData})
							.addClass(coreClass + cellClass)
							.css(cellCSS);

						// Add cell to calendar
						calendar.append(cell);
					}
				}

				// Render the month / year title

				// Helper function for toggling select and text
				var toggleYearMonthSelect = function(showYear) {
					var show = 'inline-block';
					var hide = 'none';

					if(options.allowMonthSelect) {
						monthText.css({ display: !showYear ? hide : show });
						monthSelect.css({ display: !showYear ? show : hide });
					}

					if(options.allowYearSelect) {
						yearText.css({ display: showYear ? hide : show });
						yearSelect.css({ display: showYear ? show : hide });
					}
				};

				// Helper function when select is updated
				var onYearMonthSelect = function() {
					options.firstDate = new Date(yearSelect.val(), monthSelect.val(), 1);
					self.render();
				};

				// Build month selector
				var monthSelect = $('<select/>')
									.hide()
									.change(onYearMonthSelect);

				// Build year selector
				var yearSelect = $('<select/>')
									.hide()
									.change(onYearMonthSelect);

				// Build month label
				var monthText = $('<span/>')
									.html(monthNames[firstDateMonth])
									.mousedown(function() { return false; })
									.click(function(e) {
										e.stopPropagation();
										toggleYearMonthSelect(false);
									});

				// Build year label
				var yearText = $('<span/>')
									.html(firstDateYear)
									.mousedown(function() { return false; })
									.click(function(e) {
										e.stopPropagation();
										toggleYearMonthSelect(true);
									});

				// Populate month select
				$.each(monthNames, function(i, v) {
					if(options.allowMonthSelect && selectableMonths._indexOf(i) != -1) {
						var o = $('<option/>').html(v).attr('value', i);
						if(i == firstDateMonth) { o.attr('selected', 'selected');}
						monthSelect.append(o);
					}
				});

				// Populate year select
				$.each(selectableYears, function(i, v) {
					if(options.allowYearSelect) {
						var o = $('<option/>').html(v).attr('value', v);
						if(v == firstDateYear) { o.attr('selected', 'selected'); }
						yearSelect.append(o);
					}
				});

				var titleYearMonth = $('<div/>')
										.append(monthText)
										.append(monthSelect)
										.append(yearText)
										.append(yearSelect);

				// Add to title
				titleCell.children().remove();
				titleCell.append(titleYearMonth);

				// Run the callback signaling end of the render
				renderCalback = renderCalback || (function() {});
				renderCalback();
			}
		};

		// Return the plugin
		return glDatePicker;
	})();

	// One time initialization of useful prototypes
	(function() {
		Date.prototype._clear = function() {
			this.setHours(0);
			this.setMinutes(0);
			this.setSeconds(0);
			this.setMilliseconds(0);

			return this;
		};

		Date.prototype._time = function() {
			return this._clear().getTime();
		};

		Date.prototype._max = function() {
			var isLeapYear = (new Date(this.getYear(), 1, 29).getMonth() == 1) ? 1 : 0;
			var days = [31, 28 + isLeapYear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			return days[this.getMonth()];
		};

		Date.prototype._add = function(days) {
			this.setDate(this.getDate() + days);
		};

		Date.prototype._first = function() {
			var date = new Date(this);
				date.setDate(1);

			return date;
		};

		Date.prototype._val = function() {
			this._clear();

			return {
				year: this.getFullYear(),
				month: this.getMonth(),
				date: this.getDate(),
				time: this.getTime(),
				day: this.getDay()
			};
		};

		Array.prototype._indexOf = function(value) {
			return $.inArray(value, this);
		}
	})();
})();