import { useState, useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import { animateScroll as scroll } from 'react-scroll'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { slugify } from '@open-tender/js'
import { Heading } from '@open-tender/components'

const MenuItemGroupsNavScrollButtonView = styled.button`
  font-size: ${(props) => props.theme.fonts.sizes.small};
  padding: 1rem 0 0;
  height: 4.5rem;
`

const MenuItemGroupsNavScrollButtonActive = styled(Heading)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 4.5rem;
  padding: 1.1rem 0 0;
  font-size: ${(props) => props.theme.fonts.sizes.small};
  border-bottom: ${(props) => props.theme.border.width} solid
    ${(props) => props.theme.border.color};
`

const MenuItemGroupsNavScrollButton = ({ name, active, offset = 0 }) => {
  const id = slugify(name)

  const onClick = (evt) => {
    evt.preventDefault()
    evt.target.blur()
    const element = document.getElementById(id)
    const position = element.offsetTop - offset
    scroll.scrollTo(position, {
      duration: 500,
      smooth: true,
      offset: 0,
    })
    const items = element.querySelectorAll('button')
    const firstItem = items.length ? items[0] : null
    if (firstItem) firstItem.focus()
  }

  return active ? (
    <MenuItemGroupsNavScrollButtonActive>
      {name}
    </MenuItemGroupsNavScrollButtonActive>
  ) : (
    <MenuItemGroupsNavScrollButtonView onClick={onClick}>
      {name}
    </MenuItemGroupsNavScrollButtonView>
  )
}

const MenuItemGroupsNavScrollView = styled.div`
  width: 100%;
  overflow-x: scroll;
  transition: all 500ms ease;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 4.5rem;

    li {
      display: block;
      flex-shrink: 0;
      padding: 0 0 0 ${(props) => props.theme.layout.padding};
      @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        padding-left: ${(props) => props.theme.layout.paddingMobile};
      }

      &:last-child {
        padding-right: ${(props) => props.theme.layout.padding};
        @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
          padding-right: ${(props) => props.theme.layout.paddingMobile};
        }
      }
    }
  }
`

// https://stackoverflow.com/questions/51229742/javascript-window-scroll-behavior-smooth-not-working-in-safari
const smoothHorizontalScrolling = (container, time, amount, start) => {
  let eAmt = amount / 100
  let curTime = 0
  let scrollCounter = 0
  while (curTime <= time) {
    window.setTimeout(shs, curTime, container, scrollCounter, eAmt, start)
    curTime += time / 100
    scrollCounter++
  }
}

const shs = (e, sc, eAmt, start) => {
  const scrolledAmount = eAmt * sc + start
  e.scrollLeft = scrolledAmount
}

const getActiveElement = (elements, navOffset) => {
  return elements
    .filter((i) => i.getBoundingClientRect().top <= navOffset)
    .reduce((max, i) => {
      return max &&
        max.getBoundingClientRect().top > i.getBoundingClientRect().top
        ? max
        : i
    }, null)
}

const MenuItemGroupsNavScroll = ({ items }) => {
  const theme = useTheme()
  const navRef = useRef(null)
  const listRef = useRef(null)
  const [active, setActive] = useState(null)
  const { navHeight, navHeightMobile } = theme.layout
  const headerHeight = isBrowser ? navHeight : navHeightMobile
  const headerHeightInPixels = parseInt(headerHeight.replace('rem', '')) * 10
  const navBarHeight = navRef.current?.offsetHeight || 45
  const itemHeaderHeight = 60 // set to 60 for all brands
  const topOffset = headerHeightInPixels + itemHeaderHeight + navBarHeight
  const paddingTop = 30
  const navOffset = topOffset + paddingTop
  const elements = Array.from(document.getElementsByName('section'))
  const scrollOffset = itemHeaderHeight + navBarHeight + paddingTop - 1

  useEffect(() => {
    const handleScroll = () => {
      if (elements.length) {
        setActive(getActiveElement(elements, navOffset + 10))
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', () => handleScroll)
    }
  }, [navOffset, elements, active])

  useEffect(() => {
    if (active) {
      const navActive = document.getElementById(`nav-${active.id}`)
      if (navActive) {
        const itemOffset = navActive.getBoundingClientRect().x
        const parentOffset = navActive.offsetParent.getBoundingClientRect().x
        if (navRef.current) {
          smoothHorizontalScrolling(
            navRef.current,
            250,
            itemOffset,
            -parentOffset
          )
        }
      }
    }
  }, [active])

  return (
    <MenuItemGroupsNavScrollView ref={navRef}>
      <ul ref={listRef}>
        {items.map((name, index) => {
          const sectionId = slugify(name)
          const activeId = active ? active.id : null
          return (
            <li key={`${sectionId}-${index}`} id={`nav-${sectionId}`}>
              <MenuItemGroupsNavScrollButton
                name={name}
                offset={scrollOffset}
                active={activeId === sectionId}
              />
            </li>
          )
        })}
      </ul>
    </MenuItemGroupsNavScrollView>
  )
}

MenuItemGroupsNavScroll.displayName = 'MenuItemGroupsNavScroll'
MenuItemGroupsNavScroll.propTypes = {
  items: propTypes.array,
  offset: propTypes.number,
}

export default MenuItemGroupsNavScroll
