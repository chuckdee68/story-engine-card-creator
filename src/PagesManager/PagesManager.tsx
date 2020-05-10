import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { PaperCard } from '../PaperCard/PaperCard'
import { CardType } from '../Card/Card'
import { DisplayOptions } from '../App'

const CARDS_PER_PAGE = 12

type PagesManagerProps = {
  cards: CardType[]
  setActiveCardIdx: (index: number) => void
  displayOptions: DisplayOptions
}

const PaperCardScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  @media print {
    overflow: visible;
  }
`

const InnerScrollContainer = styled.div<{multiplier: number}>`
  width: 100%;
  height: 100%;
  transform-origin: top left;
  ${({ multiplier }) => `transform: scale(${multiplier});`}
  @media print {
    transform: none;
  }
`

const PageWrapper = styled.div`
  display: inline-block;
  margin: 2.5% 5%;
  &:first-of-type {
    margin-top: 5%;
  }
  &:last-of-type {
    margin-bottom: 5%;
  }
  @media print {
    margin: 0 !important;
  }
`

const BackPageWrapper = styled(PageWrapper)<{visible: boolean}>`
  display: ${({ visible }) => visible ? 'inline-block' : 'none'};
  @media print {
    display: inline-block !important;
  }
`

export const PagesManager = ({
  cards,
  setActiveCardIdx,
  displayOptions
}: PagesManagerProps) => {
  const [widthMultiplier, setWidthMultiplier] = useState(1)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { displayBacks, backQuality } = displayOptions
  const numberOfPages = Math.ceil(cards.length / CARDS_PER_PAGE)
  const pages = Array.from(Array(numberOfPages).keys()).map(i => {
    return cards.slice(i*CARDS_PER_PAGE, (i+1)*CARDS_PER_PAGE)
  })
  useEffect(() => {
    const updateWidth = () => {
      const containerWidth = containerRef.current?.clientWidth || 0
      const pageWidth = 795.69 // pixels for 210mm, A4
      const paddedWidth = pageWidth * 1.10
      const multiplier = containerWidth / paddedWidth
      if (multiplier) {
        setWidthMultiplier(multiplier)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])
  return (
    <PaperCardScrollContainer ref={containerRef}>
      <InnerScrollContainer multiplier={widthMultiplier}>
        {pages.map((cardsOnPage, index) => {
          return (
            <div key={`page-set-${index}`}>
              <PageWrapper
                key={`front-page-${index}`}
              >
                <PaperCard
                  offsetIndex={index * CARDS_PER_PAGE}
                  cards={cardsOnPage}
                  setActiveCard={setActiveCardIdx}
                />
              </PageWrapper>
              <BackPageWrapper
                key={`back-page-${index}`}
                visible={displayBacks}
              >
                <PaperCard
                  offsetIndex={index * CARDS_PER_PAGE}
                  cards={cardsOnPage}
                  setActiveCard={setActiveCardIdx}
                  backQuality={backQuality}
                  backs
                />
              </BackPageWrapper>
            </div>
          )
        })}
      </InnerScrollContainer>
    </PaperCardScrollContainer>
  )
}