/*Copyright: © 2022 NC Squared Ltd, All Rights Reserved*/


/**
 * Report errors
 * @param {string} error - Error message
 * @param {string[]?} rest args
 * @returns {void}
 */
var reportError = (error, ...rest) => {
  console.error(error, ...rest);
  return;
};

// @ts-nocheck

// GRAPHIC SETTINGS
const blockHeight = 40; // height of any source, team name or team row; margins included
const blockMidOffset = 24; // distance from top of the block to arrow head
const markerOffset = 12; // arrow head width
const arcRadius = 12;
const teamBottomMargin = 16;
const teamIconOffset = 28;
// prettier-ignore
const arcs = {
  downCW: 'c' + (arcRadius * 0.65) + ',0 ' + arcRadius + ',' + (arcRadius * 0.5) + ' ' + arcRadius + ',' + arcRadius,
  upCCW: 'c' + (arcRadius * 0.65) + ',0 ' + arcRadius + ',' + (-arcRadius * 0.5) + ' ' + arcRadius + ',' + (-arcRadius),
  downCCW: 'c0,' + (arcRadius * 0.65) + ' ' + (arcRadius * 0.5) + ',' + arcRadius + ' ' + arcRadius + ',' + arcRadius,
  upCW: 'c0,' + (-arcRadius * 0.65) + ' ' + (arcRadius * 0.5) + ',' + (-arcRadius) + ' ' + arcRadius + ',' + (-arcRadius),
  empty: 'c0,0 0,0 0,0',
  linear: 'c0,0 0,0 ' + arcRadius + ',0',
};

/**
 * Draw the connections between sources and teams
 * @returns {void}
 */
function drawMainArrow() {
  const teamsContainer = document.getElementById('n2__apv-teams');
  const sourcesContainer = document.getElementById('n2__apv-sources');
  const arrowContainer = document.getElementById('n2__apv-main-arrow');
  const sources = Array.from(sourcesContainer.getElementsByClassName('source'));
  const rows = Array.from(teamsContainer.getElementsByClassName('row'));
  const teams = Array.from(teamsContainer.getElementsByClassName('team'));

  if (
    !(
      teamsContainer &&
      arrowContainer &&
      sources &&
      sources.length &&
      rows &&
      rows.length
    )
  ) {
    return;
  }

  const svg = arrowContainer.querySelector('svg');
  const arrowBox = arrowContainer.getBoundingClientRect();

  if (!svg) {
    reportError('Arrow SVG element not found');
    return;
  }

  const svgSize = {
    w: arrowBox.width,
    h: teamsContainer.offsetHeight,
  };

  svg.innerHTML = '';
  svg.setAttribute('viewBox', '0 0 ' + svgSize.w + ' ' + svgSize.h);
  const selectionArrows = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  selectionArrows.classList.add('for-selection');
  svg.appendChild(selectionArrows);
  const hoverArrows = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  hoverArrows.classList.add('for-hover');
  svg.appendChild(hoverArrows);

  let teamOffset = 0;
  teams.forEach(function(t) {
    const teamRows = Array.from(t.getElementsByClassName('row'));
    teamRows.forEach(function(tr, trIdx) {
      if (tr.classList.contains('row-heading')) {
        return true;
      }

      const rowIdx = rows.indexOf(tr);
      const sourceID = tr.getAttribute('data-source');
      let sourceTop = 0;
      sources.forEach((source) => {
        if (source.getAttribute('data-source-id') === sourceID) {
          sourceTop = source.getBoundingClientRect().top;
          return false;
        }
      });
      const sourceY = sourceTop - arrowBox.top + blockMidOffset;
      const teamY = teamOffset + blockMidOffset;
      const targetY = teamOffset + (trIdx + 1) * blockHeight + blockMidOffset;

      let d;
      if (t.classList.contains('filtered')) {
        d = getPathToTargetViaTeam(arrowBox.width, sourceY, teamY, targetY);
      } else {
        d = getPathToTarget(arrowBox.width, sourceY, targetY);
      }

      createArrow(d, sourceID, rowIdx, selectionArrows, false);
      createArrow(d, sourceID, rowIdx, hoverArrows, true);
    });

    teamOffset += blockHeight;
    if (!t.classList.contains('collapsed')) {
      teamOffset += teamRows.length * blockHeight;
    }
    teamOffset += teamBottomMargin;
  });
}

/**
 * Update the connections between sources and teams
 * (used for team collapse / uncollapse)
 * @returns {void}
 */
function updateMainArrow(clickedTeam) {
  const teamsContainer = document.getElementById('n2__apv-teams');
  const sourcesContainer = document.getElementById('n2__apv-sources');
  const arrowContainer = document.getElementById('n2__apv-main-arrow');
  const sources = Array.from(sourcesContainer.getElementsByClassName('source'));
  const rows = Array.from(teamsContainer.getElementsByClassName('row'));
  const teams = Array.from(teamsContainer.getElementsByClassName('team'));

  const arrowBox = arrowContainer.getBoundingClientRect();
  let teamOffset = 0;

  teams.forEach(function(t) {
    const isFiltered = t.classList.contains('filtered');
    const isCollapsed = t.classList.contains('collapsed');
    const teamRows = Array.from(t.getElementsByClassName('row'));
    teamRows.forEach(function(tr, trIdx) {
      if (tr.classList.contains('row-heading')) {
        return true;
      }

      const rowIdx = rows.indexOf(tr);
      const sourceID = tr.getAttribute('data-source');
      let sourceTop = 0;
      sources.forEach((source) => {
        if (source.getAttribute('data-source-id') === sourceID) {
          sourceTop = source.getBoundingClientRect().top;
          return false;
        }
      });
      const sourceY = sourceTop - arrowBox.top + blockMidOffset;
      const teamY = teamOffset + blockMidOffset;
      const targetY = teamOffset + (trIdx + 1) * blockHeight + blockMidOffset;

      // get final path from source to target row
      let d;
      if (isCollapsed) {
        d = getPathToTarget(arrowBox.width, sourceY, teamY);
      } else {
        if (isFiltered) {
          d = getPathToTargetViaTeam(arrowBox.width, sourceY, teamY, targetY);
        } else {
          d = getPathToTarget(arrowBox.width, sourceY, targetY);
        }
      }

      // select a pair of arrows:
      // arrows[0] - selection-arrow
      // arrows[1] - hover-arrow
      const arrows = document.querySelectorAll(
        "[data-source='" + sourceID + "'][data-row-idx='" + rowIdx + "']"
      );
      completeTweens(arrows[0]);
      completeTweens(arrows[1]);

      if (
        t === clickedTeam &&
        (tr.classList.contains('selected-as-target') ||
          tr.classList.contains('active-as-selected'))
      ) {
        // IF ARROW IS UNDER CLICKED TEAM:

        // instantly morph hover-arrow (which is always invisible when this function is called)
        // and take care of arrow head
        gsap.set(arrows[1], {
          attr: { d: d },
          onStart: function() {
            if (!isCollapsed) {
              arrows[1].classList.remove('marker-hidden');
            }
          },
          onComplete: function() {
            if (isCollapsed) {
              arrows[0].classList.add('marker-hidden');
              arrows[1].classList.add('marker-hidden');

              // on collapse:
              // - 'undraw' arrow to the team level,
              // - don't forget to morph it to final state
              const lengthToTarget = arrows[0].getTotalLength();
              const lengthToTeam =
                lengthToTarget - arrows[1].getTotalLength() + arcRadius;
              gsap.set(arrows[0], {
                attr: {
                  'marker-end': '',
                  'stroke-dasharray': lengthToTarget,
                  'stroke-dashoffset': 0,
                },
              });
              if (isFiltered) {
                gsap.to(arrows[0], {
                  duration: 0.2,
                  attr: { d: d },
                  ease: 'power1.inOut',
                });
              }
              gsap.to(arrows[0], {
                duration: 0.2,
                attr: { 'stroke-dashoffset': lengthToTeam },
                ease: 'power1.inOut',
                onComplete: function() {
                  if (!isFiltered) {
                    gsap.set(arrows[0], {
                      attr: { d: d },
                    });
                  }
                },
              });
            } else {
              // on uncollapse:
              // - morph arrow it to final state
              //   (it doesn't change arrow visually because of stroke-dashoffset parameter)
              // - 'draw' arrow from team level to target,
              const lengthToTarget = arrows[1].getTotalLength();
              gsap.set(arrows[0], {
                attr: {
                  d: d,
                  'stroke-dasharray': lengthToTarget
                },
              });
              gsap.to(arrows[0], {
                duration: 0.2,
                attr: { 'stroke-dashoffset': 0 },
                ease: 'power1.inOut',
                onComplete: function() {
                  arrows[0].classList.remove('marker-hidden');
                  gsap.set(arrows[0], {
                    attr: {
                      'marker-end': 'url("#n2__apv-arrow-selected-end")',
                    },
                  });
                },
              });
            }
          },
        });
      } else {
        // IF ARROW IS NOT UNDER CLICKED TEAM --> just morph and take care of arrow heads
        if (isCollapsed) {
          arrows[0].classList.add('marker-hidden');
          arrows[1].classList.add('marker-hidden');
        } else {
          arrows[1].classList.remove('marker-hidden');
        }
        gsap.set(arrows[1], {
          attr: {
            d: d,
            'stroke-dashoffset': 0
          }
        });

        const lengthToTarget = arrows[1].getTotalLength();
        gsap.set(arrows, {
          attr: { 'stroke-dasharray': lengthToTarget }
        });
        gsap.to(arrows[0], {
          duration: 0.3,
          attr: {
            d: d,
            'stroke-dashoffset': 0
          },
          onComplete: function() {
            if (!isCollapsed) {
              arrows[0].classList.remove('marker-hidden');
            }
          },
        });
      }
    });

    teamOffset += blockHeight;
    if (!isCollapsed) {
      teamOffset += teamRows.length * blockHeight;
    }
    teamOffset += teamBottomMargin;
  });
}

/**
 * Calculate SVG path data for connection from source directly to target
 * @returns {void}
 */
function getPathToTarget(fillWidth, sourceY, targetY) {
  const pathData = {
    startPoint: 'M0,' + sourceY,
    firstHorizontalSegment: ' H' + (fillWidth * 0.3 - arcRadius),
    middleHorizontalSegment: ' H' + (fillWidth - teamIconOffset - arcRadius),
    lastHorizontalSegment: ' H' + (fillWidth - markerOffset),
    firstVerticalSegment: ' V' + (targetY + arcRadius * turn(targetY, sourceY)),
    lastVerticalSegment: ' V' + targetY,
  };

  let d = pathData.startPoint;
  if (targetY > sourceY) {
    d +=
      pathData.firstHorizontalSegment +
      arcs.downCW +
      pathData.firstVerticalSegment +
      arcs.downCCW +
      pathData.middleHorizontalSegment;
  } else if (targetY < sourceY) {
    d +=
      pathData.firstHorizontalSegment +
      arcs.upCCW +
      pathData.firstVerticalSegment +
      arcs.upCW +
      pathData.middleHorizontalSegment;
  } else {
    d +=
      pathData.firstHorizontalSegment +
      arcs.linear +
      pathData.firstVerticalSegment +
      arcs.linear +
      pathData.middleHorizontalSegment;
  }
  // this piece has no visual output;
  // we need these points to animate the connection
  d +=
    arcs.linear +
    pathData.lastVerticalSegment +
    arcs.empty +
    pathData.lastHorizontalSegment;

  return d;
}

/**
 * Calculate SVG path data for connection from source to team name,
 * then from team name to the target
 * @returns {void}
 */
function getPathToTargetViaTeam(fillWidth, sourceY, teamY, targetY) {
  const pathData = {
    startPoint: 'M0,' + sourceY,
    firstHorizontalSegment: ' H' + (fillWidth * 0.3 - arcRadius),
    middleHorizontalSegment: ' H' + (fillWidth - teamIconOffset - arcRadius),
    lastHorizontalSegment: ' H' + (fillWidth - markerOffset),
    firstVerticalSegment: ' V' + (teamY + arcRadius * turn(teamY, sourceY)),
    lastVerticalSegment: ' V' + (targetY + arcRadius * turn(targetY, teamY)),
  };

  let d = pathData.startPoint;
  if (teamY > sourceY) {
    d +=
      pathData.firstHorizontalSegment +
      arcs.downCW +
      pathData.firstVerticalSegment +
      arcs.downCCW +
      pathData.middleHorizontalSegment;
  } else if (teamY < sourceY) {
    d +=
      pathData.firstHorizontalSegment +
      arcs.upCCW +
      pathData.firstVerticalSegment +
      arcs.upCW +
      pathData.middleHorizontalSegment;
  } else {
    d +=
      pathData.firstHorizontalSegment +
      arcs.linear +
      pathData.firstVerticalSegment +
      arcs.linear +
      pathData.middleHorizontalSegment;
  }
  d +=
    arcs.downCW +
    pathData.lastVerticalSegment +
    arcs.downCCW +
    pathData.lastHorizontalSegment;

  return d;
}

/**
 * Helper
 * @param {number} s - Y-coordinate of source
 * @param {number} t - Y-coordinate of target

 * @returns {number} - coefficient for path turn
 */
const turn = function(s, t) {
  if (s > t) return -1;
  else if (t > s) return 1;
  else return 0;
};

/**
 * Create and append the blank arrow with given params
 * @param {string} d - svg path shape coordinates
 * @param {Source["id"]} sourceId - ID of the source
 * @param {number} rowIdx - index of target row
 * @param {Element} parentNode - node to append the arrow
 * @param {boolean} isAnimated - if supports drawing animation
 * @returns {void}
 */
function createArrow(d, sourceId, rowIdx, parentNode, isAnimated) {
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('data-source', sourceId);
  path.setAttribute('data-row-idx', rowIdx.toString());
  parentNode.appendChild(path);
  if (isAnimated) {
    const pathLength = path.getTotalLength();
    path.setAttribute('stroke-dasharray', pathLength.toString());
    path.setAttribute('stroke-dashoffset', pathLength.toString());
  } else {
    path.setAttribute('marker-end', 'url(#n2__apv-arrow-selected-end)');
  }
}

/**
 * Animate arrow ("draw" the line, add marker at the end)
 * @param {SVGPathElement} arrow - arrow to animate (<path> element)
 * @param {number} dur - animation duration in seconds
 * @returns {void}
 */
function drawArrow(arrow, dur) {
  completeTweens(arrow);

  gsap.set(arrow, {
    opacity: 1,
    attr: {
      'marker-end': '',
      'stroke-dasharray': arrow.getTotalLength(),
    },
  });

  gsap.fromTo(
    arrow,
    {
      attr: { 'stroke-dashoffset': arrow.getTotalLength() },
    },
    {
      duration: dur,
      attr: { 'stroke-dashoffset': 0 },
      ease: 'power1.inOut',
      onComplete: function() {
        gsap.set(arrow, {
          attr: { 'marker-end': 'url(#n2__apv-arrow-end)' },
        });
      },
    }
  );
}

/**
 * Animate arrow backwards (add marker first, then draw path from end to beginning)
 * @param {SVGPathElement} arrow - arrow to animate (<path> element)
 * @param {number} dur - animation duration in seconds
 * @returns {void}
 */
function drawArrowReverse(arrow, dur) {
  completeTweens(arrow);

  gsap.set(arrow, {
    opacity: 1,
    attr: {
      'marker-end': 'url(#n2__apv-arrow-end)',
      'stroke-dasharray': arrow.getTotalLength(),
    },
  });

  gsap.fromTo(
    arrow,
    {
      attr: { 'stroke-dashoffset': arrow.getTotalLength() },
    },
    {
      duration: dur,
      attr: { 'stroke-dashoffset': arrow.getTotalLength() * 2 },
      ease: 'power1.inOut',
    }
  );
}

/**
 * Complete the animations for the given arrow so that we can start another without
 * potentially losing some of the changes if we were to kill them
 * @param {SVGPathElement} arrow - arrow to complete the animation for
 */
function completeTweens(arrow) {
  const tweens = gsap.getTweensOf(arrow);
  if (tweens) {
    tweens.forEach((tween) => tween.totalProgress(1));
  }
}

/**
 * Fade out the arrow (it can remain visible if selected by click)
 * @param {SVGPathElement} arrow - arrow to hide (<path> element)
 * @returns {void}
 */
function hideArrow(arrow) {
  gsap.to(arrow, {
    duration: 0.1,
    opacity: 0,
  });
}

/**
 * The Config object contains general static configuration
 */
var config = { baseUrl: '.', methodIcons: {}, showObjectType: true };

/**
 * All existing box types
 * @typedef {string}
 */
const itemTypes = {
  f: 'filter',
  al: 'algorithm',
  as: 'assignment',
  o: 'outcome',
};

/**
 * Create and append new DOM element
 * @param {string} innerHTML - content to put inside the tag
 * @param {any} tag - HTML tag
 * @param {Element} parentNode - element to append the new one
 * @returns {Element}
 */
function appendElement(innerHTML, tag, parentNode) {
  let el = document.createElement(tag);
  el.innerHTML = innerHTML;
  parentNode.appendChild(el);
  return el;
}

/**
 * Grab icon from given SVG sprite, create <svg> icon and append it to the specified parent
 * @param {string} sprite - URL of the spite to navigate to
 * @param {string} name - name of the icon within the spite
 * @param {Element} parentNode - element to append the icon
 * @param {string[]} [classNames] - all icon's class names
 * @returns {Element}
 */
function appendIcon(sprite, name, parentNode, classNames) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  el.classList.add('icon');
  if (classNames) {
    classNames.forEach(function(cls) {
      el.classList.add(cls);
    });
  }
  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `${config.baseUrl}/assets/${sprite}.svg#${name}`
  );
  el.appendChild(use);
  parentNode.appendChild(el);
  return el;
}

/**
 * HTML encodes a string
 * @param {string} text - String to encode
 */
function htmlEncode(text) {
  const dummySpan = document.createElement('span');
  dummySpan.textContent = text;
  return dummySpan.innerHTML
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * Clear the whole grid and reset all the animations and delayed calls
 * @returns {void}
 */
function eraseView() {
  gsap.globalTimeline.clear();
  const apv = document.querySelector('#n2__apv');
  if (apv && apv.parentNode) {
    apv.parentNode.removeChild(apv);
  }
  const apvSymbols = document.querySelector('#n2__apv-symbols');
  if (apvSymbols && apvSymbols.parentNode) {
    apvSymbols.parentNode.removeChild(apvSymbols);
  }
}

/**
 * Gets document elements by class name
 * @param {string} selector - Class selector
 * @param {Element} [scope] - Scope to query from
 * @returns {Element[]}
 */
function getElementsByClass(selector, scope) {
  scope = scope || document.getElementById('n2__apv');
  return Array.from(scope.getElementsByClassName(selector));
}

/**
 * Gets the content of an element
 * @param {string} selector - Class selector
 * @param {Element} [scope] - Scope to query from
 * @returns {string}
 */
function getElementContentByClass(selector, scope) {
  const elements = getElementsByClass(selector, scope);
  if (elements && elements.length > 0) {
    return elements[0].textContent;
  }
  return '';
}

/**
 * Gets selection arrows
 * @returns {SVGPathElement[]}
 */
function getSelectionArrows() {
  return Array.from(
    document.querySelectorAll('#n2__apv-main-arrow .for-selection path')
  );
}

/**
 * Gets hover arrows
 * @returns {SVGPathElement[]}
 */
function getHoverArrows() {
  return Array.from(document.querySelectorAll('#n2__apv-main-arrow .for-hover path'));
}

/**
 * @typedef {{el: HTMLElement, eventName: String, handler: Function}[]}
 */
let _handlers = [];

/**
 * Adds an event handler to a dom element and stores it so it can be removed later
 * @param {Document|Element} el The element to add the handler to 
 * @param {String} eventName The event name
 * @param {EventListenerOrEventListenerObject} handler The event handler
 */
function _addEventListener(el, eventName, handler) {
  _handlers.push({ el: el, eventName: eventName, handler: handler });

  el.addEventListener(eventName, handler);
}

/**
 * Registers click events in the DOM
 * @param {(event: APVClickEvent) => void} onClick
 * @returns {void }
 */
function registerClickEvents(onClick) {
  const apv = document.getElementById('n2__apv');
  const sources = getElementsByClass('source', apv);
  const teams = getElementsByClass('team', apv);
  const rows = getElementsByClass('row', apv);
  const selectionArrows = getSelectionArrows();

  _addEventListener(document, 'click', clickHandler.bind(null, onClick, sources, teams, rows, selectionArrows));
}

/**
 * Handles the click event on the DOM
 * @param {(event: APVClickEvent) => void} onClick The provided on click handler 
 * @param {Element[]} sources The sources
 * @param {Element[]} teams The teams
 * @param {Element[]} rows The distributor rows
 * @param {SVGPathElement[]} selectionArrows The selection arrows
 * @param {Event} e The native click event 
 */
function clickHandler(onClick, sources, teams, rows, selectionArrows, e) {
  if (!(e.target instanceof Element)) {
    return;
  }

  const target = e.target.parentElement || e.target;

  if (target.classList.contains('source')) {
    const clickedSource = target;
    const sourceId = clickedSource.getAttribute('data-source-id');

    // update sources
    clearSources();
    clickedSource.classList.add('active-as-selected');

    // update arrows
    updateArrowsBySource(selectionArrows, sourceId);

    // update teams and rows
    clearRows(rows);
    updateTeamsAndRowsBySource(teams, sourceId, false);

    // update items
    clearItems();

    onClick({
      type: 'source',
      section: 'name',
      id: clickedSource.getAttribute('data-source-id'),
      name: getElementContentByClass('source-name', clickedSource)
    });
  } else if (target.classList.contains('team-name')) {
    // indicate click
    const clickedTeamName = target;
    clickedTeamName.classList.add('clicked');
    gsap.delayedCall(0.15, () => {
      clickedTeamName.classList.remove('clicked');
    });

    const teamId = clickedTeamName.parentElement.getAttribute('data-team-id');
    onClick({
      type: 'team',
      section: 'name',
      id: teamId,
      name: getElementContentByClass('team-name-text', clickedTeamName)
    });
  } else if (e.target.classList.contains('team-collapse')) {
    // collapse / uncollapse
    const clickedTeam = target.parentElement.parentElement;
    const rows = clickedTeam.querySelector('.team-rows');
    if (!clickedTeam.classList.contains('collapsed')) {
      updateCollapseIndicator(clickedTeam);
      gsap.to(rows, {
        duration: 0.3,
        height: 0,
        // scaleY: 0,
        transformOrigin: '0% 0%',
      });
    } else {
      gsap.to(rows, {
        duration: 0.3,
        height: 'auto',
        // scaleY: 1
      });
    }
    clickedTeam.classList.toggle('collapsed');
    updateMainArrow(clickedTeam);
  } else if (target.classList.contains('row')) {
    const clickedRow = target;

    // update arrows
    const clickedRowIdx = rows.indexOf(clickedRow);
    updateArrowsByTarget(selectionArrows, clickedRowIdx);

    // update rows
    clearRows(rows);
    clickedRow.classList.add('active-as-selected');

    // update teams
    const team = clickedRow.parentElement.parentElement;
    updateTeamsByTarget(teams, team, false);

    // update sources
    clearSources();
    const sourceId = clickedRow.getAttribute('data-source');
    sources.forEach((source) => {
      if (source.getAttribute('data-source-id') === sourceId) {
        source.classList.add('active-as-source');
        return false;
      }
    });

    // update items
    clearItems();

    const distributorId = clickedRow.getAttribute('data-distributor-id');
    const teamId = clickedRow.getAttribute('data-team-id');
    onClick({
      type: 'distributor',
      section: 'name',
      id: distributorId,
      parentId: teamId,
      name: getElementContentByClass('row-name-text', clickedRow)
    });
  } else if (target.classList.contains('item')) {
    const clickedItem = target;

    clearItems();

    clickedItem.classList.add('active');
    const activeRow = clickedItem.parentElement.parentElement;
    const sourceId = activeRow.getAttribute('data-source');

    // update arrows
    const activeRowIdx = rows.indexOf(activeRow);
    updateArrowsByTarget(selectionArrows, activeRowIdx);

    // update teams
    const team = activeRow.parentElement.parentElement;
    updateTeamsByTarget(teams, team, false);

    // update rows
    clearRows(rows);
    activeRow.classList.add('active-as-selected');

    // update sources
    clearSources();
    sources.forEach((source) => {
      if (source.getAttribute('data-source-id') === sourceId) {
        source.classList.add('active-as-source');
        return false;
      }
    });

    const dataType = /** @type {EventTargetSection} */ (clickedItem.getAttribute(
      'data-type'
    ));
    const distributorId = activeRow.getAttribute('data-distributor-id');
    const teamId = activeRow.getAttribute('data-team-id');
    onClick({
      type: 'distributor',
      section: dataType,
      id: distributorId,
      parentId: teamId,
      name: getElementContentByClass('row-name-text', activeRow)
    });
  } else {
    clearSources();
    clearTeams(teams);
    clearRows(rows);
    clearArrows(selectionArrows);
    clearItems();
  }
}

/**
 * Register hover events on rows and sources
 * @returns {void}
 */
function registerHoverEvents() {
  const apv = document.getElementById('n2__apv');
  const sources = getElementsByClass('source', apv);
  const teams = getElementsByClass('team', apv);
  const rows = getElementsByClass('row', apv);
  const hoverArrows = getHoverArrows();

  sources.forEach(function(s) {
    _addEventListener(s, 'mouseenter', sourceHoverHandler.bind(null, s, apv, teams, hoverArrows));
    _addEventListener(s, 'mouseleave', clearHovered);
  });

  rows.forEach(function(r, rIdx) {
    _addEventListener(r, 'mouseenter', rowHoverHandler.bind(null, r, rIdx, apv, sources, teams, rows, hoverArrows));
    _addEventListener(r, 'mouseleave', clearHovered);
  });
}

/**
 * Handles the hover event on sources
 * @param {Element} source The source element
 * @param {Element} apv The apv container element
 * @param {Element[]} teams The teams
 * @param {SVGPathElement[]} hoverArrows The hover arrows
 */
function sourceHoverHandler(source, apv, teams, hoverArrows) {
  apv.classList.add('active-hover');
  source.classList.add('hovered');
  const sourceId = source.getAttribute('data-source-id');
  hoverArrows.forEach(function(ha) {
    if (ha.getAttribute('data-source') === sourceId) {
      drawArrow(ha, 0.3);
    }
  });
  updateTeamsAndRowsBySource(teams, sourceId, true);
}

/**
 * Handles the hover event on rows
 * @param {Element} row The row element
 * @param {Number} rowIndex The index of the row element
 * @param {Element} apv The apv container element
 * @param {Element[]} sources The sources
 * @param {Element[]} teams The teams
 * @param {Element[]} rows The team rows
 * @param {SVGPathElement[]} hoverArrows The hover arrows
 */
function rowHoverHandler(row, rowIndex, apv, sources, teams, rows, hoverArrows) {
  apv.classList.add('active-hover');
  rows.forEach((r) => {
    r.classList.add(r === row ? 'hovered' : 'not-hovered');
  });

  hoverArrows.forEach((ha) => {
    if (+ha.getAttribute('data-row-idx') === rowIndex) {
      drawArrowReverse(ha, 0.3);
      const team = row.parentElement.parentElement;
      team.classList.add('has-hovered-targets');
    }
  });

  const sourceId = row.getAttribute('data-source');
  sources.forEach((s) => {
    if (s.getAttribute('data-source-id') === sourceId) {
      s.classList.add('hovered');
    }
  });

  const activeTeam = row.parentElement.parentElement;
  updateTeamsByTarget(teams, activeTeam, true);
}

/**
 * Unregister all previously registered events
 */
function unregisterEvents() {
  var length = _handlers.length;
  for (var i = 0; i < length; i++) {
    const handler = _handlers[i];
    handler.el.removeEventListener(handler.eventName, handler.handler);
  }
}

/**
 * Removes click-related classes from sources
 * @returns {void}
 */
function clearSources() {
  getElementsByClass('source').forEach((s) => {
    s.classList.remove('active-as-source');
    s.classList.remove('active-as-selected');
  });
}

/**
 * Removes click-related classes from teams
 * @param {Element[]} teams
 * @returns {void}
 */
function clearTeams(teams) {
  teams.forEach((t) => {
    t.classList.remove('has-selected-targets');
    const countEl = t.querySelector('.team-filter-sum');
    countEl.classList.add('hidden');
  });
}
/**
 * Removes click-related classes from rows
 * @param {Element[]} rows
 * @returns {void}
 */
function clearRows(rows) {
  rows.forEach((r) => {
    r.classList.remove('active-as-selected');
    r.classList.remove('selected-as-target');
  });
}

/**
 * Removes click-related classes from arrows
 * @param {Element[]} arrows
 * @returns {void}
 */
function clearArrows(arrows) {
  arrows.forEach(function(a) {
    a.classList.remove('active');
  });
}

/**
 * Removes click-related classes from items
 * @returns {void}
 */
function clearItems() {
  getElementsByClass('item').forEach((i) => i.classList.remove('active'));
}

/**
 * Show/hide selection-arrows by click on row or item
 * @param {Element[]} arrows - Arrows to update
 * @param {number} rowIdx - Index of row
 * @returns {void}
 */
function updateArrowsByTarget(arrows, rowIdx) {
  arrows.forEach(function(a) {
    if (parseInt(a.getAttribute('data-row-idx'), 10) === rowIdx) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

/**
 * Show/hide selection-arrows by click on source
 * @param {Element[]} arrows - Arrows to update
 * @param {string} sourceID - Identifier of source
 * @returns {void}
 */
function updateArrowsBySource(arrows, sourceID) {
  arrows.forEach(function(a) {
    if (a.getAttribute('data-source') === sourceID) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

/**
 * Removes all hover-related states
 * @returns {void}
 */
function clearHovered() {
  const apv = document.getElementById('n2__apv');
  apv.classList.remove('active-hover');

  getElementsByClass('hovered', apv).forEach(function(el) {
    el.classList.remove('hovered');
  });
  getElementsByClass('not-hovered', apv).forEach(function(el) {
    el.classList.remove('not-hovered');
  });

  getHoverArrows().forEach((hoverArrow) => hideArrow(hoverArrow));

  getElementsByClass('team', apv).forEach(function(t) {
    t.classList.remove('has-hovered-targets');
    updateCollapseIndicator(t);
  });
}

/**
 * Update teams & rows with new source
 * (which is selected by click or by hover)
 * @param {array} teams - all teams
 * @param {string} sourceId - new source ID
 * @param {boolean} isHovered - indicates if source ID was caused by click or by hover
 * @returns {void}
 */
function updateTeamsAndRowsBySource(teams, sourceId, isHovered) {
  teams.forEach(function(t) {
    const teamRows = getElementsByClass('row', t);
    let rowsCnt = 0;
    teamRows.forEach(function(tr) {
      if (tr.getAttribute('data-source') === sourceId) {
        tr.classList.remove('not-hovered');
        tr.classList.add(isHovered ? 'hovered' : 'selected-as-target');
        rowsCnt++;
      } else if (isHovered) {
        tr.classList.add('not-hovered');
      } else {
        tr.classList.remove('not-hovered');
      }
    });
    if (rowsCnt) {
      t.classList.add(
        isHovered ? 'has-hovered-targets' : 'has-selected-targets'
      );
    } else {
      t.classList.remove(
        isHovered ? 'has-hovered-targets' : 'has-selected-targets'
      );
    }
    if (t.classList.contains('collapsed')) {
      updateCollapseIndicator(t);
    }
  });
}

/**
 * Update teams with new target
 * (which is selected by click or by hover on row or on item)
 * @param {array} teams - all teams
 * @param {Element} activeTeam - parent team of triggered object
 * @param {boolean} isHovered - indicates if source ID was caused by click or by hover
 * @returns {void}
 */
function updateTeamsByTarget(teams, activeTeam, isHovered) {
  teams.forEach(function(t) {
    if (t === activeTeam) {
      t.classList.add(
        isHovered ? 'has-hovered-targets' : 'has-selected-targets'
      );
    } else {
      t.classList.remove(
        isHovered ? 'has-hovered-targets' : 'has-selected-targets'
      );
    }
    if (t.classList.contains('collapsed')) {
      updateCollapseIndicator(t);
    }
  });
}

/**
 * Recalculate the number on collapse icon
 * (counting hovered targets by default and clicked targets if nothing hovered)
 * @param {Element} team - team to update
 * @returns {void}
 */
function updateCollapseIndicator(team) {
  const apv = document.getElementById('n2__apv');
  const countEl = team.querySelector('.team-filter-sum');
  const rows = getElementsByClass('row', team);
  let filteredRowsCnt = 0;
  if (apv.classList.contains('active-hover')) {
    rows.forEach(function(r) {
      if (r.classList.contains('hovered')) {
        filteredRowsCnt++;
      }
    });
  } else {
    rows.forEach(function(r) {
      if (
        r.classList.contains('active-as-selected') ||
        r.classList.contains('selected-as-target')
      ) {
        filteredRowsCnt++;
      }
    });
  }
  countEl.innerHTML = filteredRowsCnt > 9 ? '*' : `${filteredRowsCnt}`;
  if (filteredRowsCnt) {
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

/**
 * Case- and Number-insensitive string comparison
 * @param a {string} - string #1
 * @param b {string} - string #2
 * @returns {boolean}
 */
function isEqual(a, b) {
  return '' + a.toUpperCase() === '' + b.toUpperCase();
}

/**
 * Tests for a function
 * @param {function} fn
 * @returns {boolean}
 */
function isFunction(fn) {
  return typeof fn === 'function';
}

/**
 * Builds scaffold HTML content
 * @param {Element} element - DOM node to attach scaffold into
 * @returns {void}
 */
function buildScaffold(element) {
  element.innerHTML = `
<div id="n2__apv" class="n2-apv grid">
  <div class="header">
    <div class="titles">
      <div class="title">
        Sources
      </div>
      <div class="title">
        Teams
      </div>
    </div>
  </div>

  <div class="content">
    <ul id="n2__apv-sources"></ul>

    <div id="n2__apv-main-arrow">
      <svg></svg>
    </div>

    <div id="n2__apv-teams"></div>
  </div>
</div>

  <svg id="n2__apv-symbols" class="common-symbols">
    <defs>
      <marker
        id="n2__apv-arrow-end"
        viewBox="0 0 10 10"
        refX="0"
        refY="3"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto"
      >
        <path d="M0,0 L0,6 L5,3 z"></path>
      </marker>
      <marker
        id="n2__apv-arrow-selected-end"
        viewBox="0 0 10 10"
        refX="0"
        refY="3"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto"
      >
        <path d="M0,0 L0,6 L5,3 z"></path>
      </marker>
      <marker
        id="n2__apv-arrow-selected-hover-end"
        viewBox="0 0 10 10"
        refX="0"
        refY="3"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto"
      >
        <path d="M0,0 L0,6 L5,3 z"></path>
      </marker>
    </defs>
  </svg>
  `;
}

/**
 * Setup graphics
 * @param {APVData} data - Data to build from
 * @returns {void}
 */
function buildView(data) {
  buildPageFromData(data);

  drawMainArrow();
}

/**
 * Builds page graphics
 * @param {APVData} data - Data to build page from
 * @returns {void}
 */
function buildPageFromData(data) {
  buildSources(data.sources);
  buildTeams(data.teams);
  // Remove any sources that are not used by any of the distributors in the teams
  hideUnusedSources();
}

/**
 * Hides any unused data sources
 * @returns {void}
 */
function hideUnusedSources() {
  // Build a map of data sources used in distributors
  const activeRows = document.querySelectorAll('.n2-apv .team .row');
  const activeDataSources = new Map();
  Array.from(activeRows)
    .filter((src) => !activeDataSources.has(src.getAttribute('data-source')))
    .map(function(path, index) {
      var dataSourceId = path.getAttribute('data-source');
      activeDataSources.set(dataSourceId, dataSourceId);
    });

  // Hide any data sources that do not appear in the activeDataSources map
  const sources = document.querySelectorAll('#n2__apv-sources .source');
  Array.from(sources)
    .filter((src) => activeDataSources.get(src.getAttribute('data-source-id')) == null)
    .forEach(function(source) {
      source.setAttribute('style', 'display: none');
    });
}

/**
 * Builds sources list
 * @param {Source[]} sources
 */
function buildSources(sources) {
  const sourcesContainer = document.getElementById('n2__apv-sources');

  sources.forEach(function(source, index) {
    let sourceEl = appendElement('', 'div', sourcesContainer);
    sourceEl.setAttribute('id', `n2__apv-source-${index}`);
    sourceEl.setAttribute('data-source-id', source.id);
    sourceEl.classList.add('source');
    let sourceWrapper = appendElement('', 'div', sourceEl);
    sourceWrapper.classList.add('wrapper');

    let spriteName;
    let spriteFolder = 'standard-sprite';
    let spriteClass;
    if (isEqual(source.type, 'Queue')) {
      spriteName = 'work_queue';
    } else if (isEqual(source.type, 'User')) {
      spriteName = 'individual';
    } else if (isEqual(source.type, 'Status')) {
      spriteName = 'text_template';
      spriteFolder = 'utility-sprite';
    } else if (isEqual(source.type, 'Trigger')) {
      spriteName = 'forward_up';
      spriteFolder = 'utility-sprite';
      spriteClass = ['trigger-icon'];
    } else if (isEqual(source.type, 'Manual')) {
      spriteName = 'change_owner';
      spriteFolder = 'utility-sprite';
    }
    appendIcon(spriteFolder, spriteName, sourceWrapper, spriteClass);
    let name = appendElement(htmlEncode(source.name), 'span', sourceWrapper);
    name.classList.add('source-name');
  });
}

/**
 * Builds team section
 * @param {Team[]} teams
 * @returns {void}
 */
function buildTeams(teams) {
  const teamsContainer = document.getElementById('n2__apv-teams');
  let rowIndex = 0;
  teams.forEach((team, index) => {
    let teamEl = appendElement('', 'div', teamsContainer);
    teamEl.classList.add('team');
    const teamId = `n2__apv-team-${index}`;
    teamEl.setAttribute('id', teamId);
    teamEl.setAttribute('data-team-id', team.id);
    teamEl.setAttribute('data-type', 'team');
    let isFiltered = team.hasObjectFilters === true;
    if (isFiltered) {
      teamEl.classList.add('filtered');
    }

    let teamNameEl = appendElement('', 'div', teamEl);
    teamNameEl.classList.add('team-name');
    if (!team.isActive) {
      teamNameEl.classList.add('inactive');
    }
    let teamNameWrapper = appendElement('', 'div', teamNameEl);
    teamNameWrapper.classList.add('wrapper');
    buildTeamName(team, teamNameWrapper, isFiltered);

    let teamRowsContainer = appendElement('', 'div', teamEl);
    teamRowsContainer.classList.add('team-rows');

    // Check to see if we have more than one type and if so we will add headings
    let distributorType = '';
    let hasMultipleTypes = false;
    team.distributors.forEach((distributor, distributorIndex) => {
      if (distributorType !== distributor.type) {
        distributorType = distributor.type;
        hasMultipleTypes = distributorIndex > 0;
        return hasMultipleTypes;
      }
    });
    distributorType = '';
    let distributorTypeLabel = '';
    team.distributors.forEach((distributor, distributorIndex) => {
      if (hasMultipleTypes && distributorType !== distributor.type) {
        distributorType = distributor.type;
        distributorTypeLabel = isEqual(distributorType, 'Distributor') ? 'Standard' : distributorType;
        buildRowHeading(`${htmlEncode(distributorTypeLabel)} Distributors`, teamRowsContainer);
      }
      if (isEqual(distributor.type, 'Distributor')) {
        buildRow(distributor, team, teamRowsContainer, ++rowIndex, teamId, distributorIndex);
      } else if (isEqual(distributor.type, 'Pull')) {
        buildRow(distributor, team, teamRowsContainer, 0, teamId, distributorIndex, 'utility-sprite', 'advertising');
      } else if (isEqual(distributor.type, 'Trigger')) {
        buildRow(distributor, team, teamRowsContainer, 0, teamId, distributorIndex, 'utility-sprite', 'forward_up');
      } else if (isEqual(distributor.type, 'Manual')) {
        buildRow(distributor, team, teamRowsContainer, 0, teamId, distributorIndex, 'utility-sprite', 'change_owner');
      }
    });
  });
}

/**
 * Builds team name
 * @param {Team} t - Team data
 * @param {Element} teamNameContainer - Element to put team name into
 * @param {boolean} isFiltered - indicates if team can be filtered
 * @returns {void}
 */
function buildTeamName(t, teamNameContainer, isFiltered) {
  if (isFiltered) {
    appendIcon('non-lightningdesignsystem', 'team_w_filter', teamNameContainer);
    appendIcon('standard-sprite', 'filter', teamNameContainer, [
      'icon-overlay',
      'team-filter-icon',
    ]);
  } else {
    appendIcon('standard-sprite', 'team_member', teamNameContainer, [
      'team-icon',
    ]);
  }
  const collapsedFilterSum = appendElement('', 'div', teamNameContainer);
  collapsedFilterSum.classList.add('icon-overlay', 'team-filter-sum');
  let teamName = `<span class="team-name-text">${htmlEncode(t.name)}</span>`;
  if (config.showObjectType) {
    teamName += `&nbsp;(${htmlEncode(t.distributionObject)})`;
  }
  appendElement(teamName, 'h2', teamNameContainer);
  const collapseContainer = appendElement('', 'div', teamNameContainer);
  collapseContainer.classList.add('team-collapse', 'wrapper');
  appendIcon('utility-sprite', 'chevrondown', collapseContainer, [
    'icon-collapse',
  ]);
}

function buildRowHeading(heading, teamEl) {
  const row = appendElement(`<h2>${htmlEncode(heading)}</h2>`, 'div', teamEl);
  row.classList.add('row', 'row-heading');
}

/**
 * Builds Distributor row
 * @param {Distributor} distributor - Distributor data
 * @param {Team} team - Team data
 * @param {Element} teamEl - Team element
 * @param {Number} rowIndex - Index of row amongst all rows
 * @param {String} teamId - Id of the team
 * @param {Number} distributorIndex - Index of distributor within team
 * @param {String} [rowIconFolder] - Optional icon folder
 * @param {String} [rowIconName] - Optional icon folder
 * @returns {void}
 */
function buildRow(distributor, team, teamEl, rowIndex, teamId, distributorIndex, rowIconFolder, rowIconName) {
  const row = appendElement('', 'div', teamEl);
  row.classList.add('row');
  if (!distributor.isActive || !team.isActive) {
    row.classList.add('inactive');
  }
  row.setAttribute('id', `${htmlEncode(teamId)}-distributor-${distributorIndex}`);
  row.setAttribute('data-source', distributor.sourceId);
  row.setAttribute('data-team-id', team.id);
  row.setAttribute('data-distributor-id', distributor.id);

  const rowWrapper = appendElement('', 'div', row);
  rowWrapper.classList.add('wrapper');

  buildRowName(distributor, rowWrapper, rowIndex, rowIconFolder, rowIconName);

  buildItem(distributor, itemTypes.f, rowWrapper, true);
  buildItem(distributor, itemTypes.al, rowWrapper, true);
  buildItem(distributor, itemTypes.as, rowWrapper, true);
  buildItem(distributor, itemTypes.o, rowWrapper, false);
}

/**
 * Builds row name
 * @param {Distributor} distributor - Distributor data
 * @param {Element} row - Element to attach name to
 * @param {number} rowsCounter - Index of row in rows
 * @param {String} [rowIconFolder] - Optional icon folder
 * @param {String} [rowIconName] - Optional icon folder
 * @returns {void}
 */
function buildRowName(distributor, row, rowsCounter, rowIconFolder, rowIconName) {
  const rowName = appendElement('', 'div', row);
  rowName.classList.add('row-name');

  if (rowIconName) {
    let iconClass;
    if (isEqual(rowIconName, 'forward_up')) {
      iconClass = ['trigger-icon'];
    }
    const iconWrapper = appendIcon(rowIconFolder, rowIconName, rowName, iconClass);
    iconWrapper.classList.add('wrapper');
  } else {
    const number = appendElement(`${rowsCounter}.`, 'div', rowName);
    number.classList.add('order');
  }

  const name = appendElement(htmlEncode(distributor.name), 'div', rowName);
  name.classList.add('row-name-text');
}

/**
 * Builds distributor item
 * @param {Distributor} distributor - Distributor data
 * @param {string} itemType - Type of item
 * @param {Element} row - Element to attach item to
 * @param {boolean} followedByArrow - Append an arrow
 */
function buildItem(distributor, itemType, row, followedByArrow) {
  let iconFolder, iconName, iconSVG;

  // select the icon to append
  if (isEqual(itemType, itemTypes.f)) {
    iconFolder = 'standard-sprite';
    iconName = 'filter';
  } else if (isEqual(itemType, itemTypes.al)) {
    iconSVG = config.methodIcons[distributor.method.toUpperCase()];
    if (!iconSVG) {
      iconFolder = 'utility-sprite';
      iconName = 'retweet';
    }
  } else if (isEqual(itemType, itemTypes.as)) {
    iconFolder = 'standard-sprite';
    iconName = 'avatar';
  } else if (isEqual(itemType, itemTypes.o)) {
    iconFolder = 'utility-sprite';
    iconName = 'record_update';
  }

  // append icon
  const item = appendElement('', 'div', row);
  item.classList.add('item');
  item.setAttribute('data-type', itemType);
  if (iconSVG) {
    item.insertAdjacentHTML('beforeend', iconSVG);
    item.firstElementChild.classList.add('icon', 'wrapper');
  } else {
    const itemWrapper = appendIcon(iconFolder, iconName, item);
    itemWrapper.classList.add('wrapper');
  }

  // append arrow if necessary
  if (followedByArrow) {
    const arrow = appendIcon('utility-sprite', 'play', row);
    arrow.classList.add('small-arrow');
  }
}

/**
 * @param {string} reason - Reason for initialisation failure
 */
const reportInitFailure = (reason) =>
  reportError('APV failed to initialise.', reason);

/**
 * Initialise APV component
 * @param {Object} config - Configuration for APV
 * @param {string} config.selector - DOM node to attach to
 * @param {APVData} config.data - Data object to build from
 * @param {string} [config.baseUrl] - The base URL that is used to locate externally hosted items such as SVG assets
 * @param {(event: APVClickEvent) => void} config.onClick - Event on element selection,
 * @param {Object} [config.methodIcons] - A mapping of distribution method name to SVG icons
 * @param {Boolean} [config.showObjectType=true] - Whether or not to show the object type next to the team name
 * @returns void
 */
const init = ({ selector, data, baseUrl, onClick, methodIcons, showObjectType = true }) => {
  // Add base url that is used to locate externally hosted items such as SVG assets
  if (baseUrl) {
    config.baseUrl = baseUrl;
  }
  if (typeof methodIcons !== 'undefined') {
    config.methodIcons = methodIcons;
  }
  config.showObjectType = showObjectType;

  // Check for selector
  const element = document.querySelector(selector);
  if (element === null) {
    return reportInitFailure(
      `Selector "${selector}" returned no results. Please supply a selector for a node currently in the DOM.`
    );
  }

  // Build view
  buildScaffold(element);
  buildView(data);

  // Check for click function
  if (!isFunction(onClick)) {
    return reportInitFailure('Click handler not provided.');
  }
  // Register events
  registerClickEvents(onClick);
  registerHoverEvents();
};

/**
 * Cleans up the APV component
 * @returns {void}
 */
const destroy = () => {
  unregisterEvents();
  eraseView();
};

const isSupported = () => {
  let el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  return typeof el.classList !== 'undefined';
};

window.n2 = window.n2 || {};
n2.apv = n2.apv || {};

n2.apv.init = ({ apvSelector, data, baseResourceUrl, onClick, methodIcons, showObjectType }) => {
  init({ selector: apvSelector, data: data, baseUrl: baseResourceUrl, onClick: onClick, methodIcons: methodIcons, showObjectType: showObjectType });
};

n2.apv.destroy = () => {
  return destroy();
};

n2.apv.isSupported = () => {
  return isSupported();
};
