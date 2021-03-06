# Table

A table component with self-managed checkboxes, sticky head, sticky right panel, and horizontal scroll widget.

# Change Log

##### 3.0.2
- z-index updates to make header above body
- Removing default styles

##### 3.0.1
- Sandbox cleanup
- Expand/collapse all (on `constructor` and `willReceiveProps`) bug fix

##### 3.0.0
- Fixing multiple calls to `onCheck` handler
- Returning map of checked results rather than array

##### 2.5.6
- Fixed group collapse all bug
- Fixed group check all bug
- Restored star selector for box sizing

##### 2.5.5
- The fix in v2.5.3 ended up being a hack, this fixes it for real

##### 2.5.4
- Removed the star selector from styling

##### 2.5.3
- Fixed IE 11 row height bug introduced in 2.5.0

##### 2.5.2
- Added margin-left to the sort arrow

##### 2.5.1
- Very minor padding fix

##### 2.5.0
- Row height is passed in as a prop so that it can be controlled by other components

##### 2.4.3
- Took out the shouldComponentUpdate

##### 2.4.2
- Fixed a race condition when checking and unchecking all

##### 2.4.1
- Fixed a bug where the select all checkbox would incorrectly be checked when not all elements were actually selected

##### 2.4.0
- Added support for row height control

##### 2.3.1
- Update default styles

##### 2.3.0
- Adding in a listener to clear all checkboxes on a listener
- upgraded to webpack 3

##### 2.2.7
- Don't show sidebar cells when groups are collapsed

##### 2.2.6
- Fix bug that was causing the header to lose stickiness on update

##### 2.2.5
- Added in safe checks to avoid null references

##### 2.2.4
- Fix resize bug that cause sidebar head to lose stickiness

##### 2.2.3
- Updating package.json to Particles URL

##### 2.2.2
- Fixed overflow issue (child elements of the table can now overflow the table)

##### 2.2.1
- Fixed sticky header scroll bug
- Changed some border styling to fix overflow cell border rendering bugs

##### 2.2.0
- Added in support for more table listeners, ability to figure out the internal state of checkedIds

##### 2.1.2
- Adjusted naming convention for ongroupselect from `key` to `name`

##### 2.1.1
- Patch groupBy

##### 2.1.0
- Adding more exposed subscribable methods for table management
-- checkAll, checkOne, resize, scroll standardized and namespaced to 'table'

##### 2.0.0
- Throttle slider actions to improve performance
- Move checkbox persistence to session storage to avoid local storage overflow bugs
- Expand all / collapse all groups now managed internally
- Remove shouldcomponentupdate for row to fix line repainting issues
- Remove lodash to lighten component footprint
- Remove immutable to lighten component footprint
- Fixed Cannot read property 'getBoundingClientRect' of undefined console error
- requestAnimationFrame used to optimize DOM changes
- Stylesheet composition implemented
- Overflow bug on inline edit dropdown
- Improved documentation (sandbox examples)
- Package size decreased from 925kb to 135kb (pre-compression)
- Removed URL updating

#### 1.2.3
- Added back missing variables and passing down of globalKey correctly

##### 1.2.2
- Removing reset.scss

##### 1.2.1
- Configure sorting features through props
```
<Table
  sorting: {
    direction: (columnDefinition) => 'desc' | 'asc' | false,
    change: (columDefinition) => return void
  }
/>
```

##### 1.0.8, 1.0.9

- Implemented prod builds

##### 1.0.7
- `renderEmpty()` method added for empty state

##### 1.0.6
- Implemented Webpack 2.2.1

##### 1.0.5
- Minor Webpack optimizations

##### 1.0.4
- _Experimental; no significant changes_

##### 1.0.3
- Return to page 1 on sort

##### 1.0.2
- Caret styles consolidated
- Removed `ripanga-` prefix on styles

##### 1.0.1
- Debugging URL construction

##### 1.0.0
- Initial commit
