# Select

A select with support for group or individual selections.

# Change Log

##### 3.11.3
- Adding expanded class toggle to outer container

##### 3.11.2
- Commenting out focus bug until future notice
- Removing caret while disabled

##### 3.11.1
- Passing event to onFocus callback

##### 3.11.0
- Update to React 15

##### 3.10.0
- `titleValue` not updating properly bug fix
- new prop `dropdownContent` to pass in something other than `items`

##### 3.9.4
- Change border color when disabled

##### 3.9.3
- Key listener bug fix, `esc` key functionality
- Building in styles that should not be overridden

##### 3.9.2
- IE 11 alignment fixes

##### 3.9.1
- Fixed button type to prevent submitting forms

##### 3.9.0
- Added the `disabled` prop that disables the entire picker if `true`

##### 3.8.2
- Fixed sane default to be better on valueFunction

##### 3.8.1
- Added a sane default to valueFunction prop

##### 3.8.0
- Added in a function to allow for more control on the displayed value

##### 3.7.0
- Adding key listeners to navigate and select the dropdown items

##### 3.6.2
- Graceful handling for null `titleValue` prop

##### 3.6.1
- Fixing onFocus if not defined

##### 3.6.0
- Added a bottom slot to the dropdown

##### 3.5.2
- Fixing spinner hover state
- Fixing message if loading vs. if empty
- Adding focus call to arrow click (in addition to search focus)

##### 3.5.1
- Fixing animation spin
- Removing 'clear search' if not searchable

##### 3.5.0
- Adding onFocus event

##### 3.4.7
- More style cleanup
- Padding adjustments based on presence of clear button

##### 3.4.6
- Style cleanup
- Dropdown opens on focus/click of input

##### 3.4.5
- Removed the controls div if not being used

##### 3.4.4
- Adding in active class to container when dropdown is expanded

##### 3.4.2, 3.4.3
- Updating package.json to Particles URL

##### 3.4.1
- Using external `prop-types` package

##### 3.4.0
- Added an onClear callback function for when picker is searchable

##### 3.3.0
- Added the ability to open the picker from the title if it is not searchable

##### 3.2.0
- Added ability to not set internal state if not needed

##### 3.1.0
- Added in ability for single selection to update state immediately and close on selection

##### 3.0.2
- Added in keyField and valueField to allow different data structure

##### 3.0.1
- Extracting and importing UUID generation
- Moving listener removal to unmount

##### 3.0.0
- Consolidating from Kaweake
- Standard { key, value } data structure
- Removed token handling
- Title value prop
- renderItem(), renderGroup(), renderEmpty()
- Multiple expanded bug fixed

##### 2.5.0
- Added prepopulate flag
- 'this' styles fix

##### 2.4.11
- Fixing max warning default

##### 2.4.10
- Fixing `key` attributes to be more specific

##### 2.4.9
- Removing reset.scss

##### 2.4.8
- Restored "clear all" to be available at all times
- Removed disabled items from select all handling

##### 2.4.7
- Fixed warning title show condition

##### 2.4.3 - 2.4.6
- (Unintentional minor bump)
- Adding Lerna publishing management
- Splitting out dev dependencies

##### 2.4.2
- Restoring all items after "clear all" action

##### 2.4.0, 2.4.1
- Leaving body expanded after selection

##### 2.3.1
- Fixing cursor for item children.

##### 2.3.0
- Removing disabled items from tokens
- Focus restored to search input after select

##### 2.2.0
- Support for disabled items

##### 2.1.1
- Rotating arrow on expand/collapse

##### 2.1.0
- Memoised to maintain original order while remaining efficient
- Token styling added

##### 2.0.0
- Stylesheet separation
- Box sizing enforcement on dropdown
- Fetch on mount
- Removed Bootstrap
- Removed unnecessary deps
- Self-contained styles

##### 1.0.0, 1.0.1
- Initial commits
