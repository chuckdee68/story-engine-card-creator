import React, { useState } from 'react'
import styled from 'styled-components'
import { PaperCard } from '../PaperCard/PaperCard'
import { CardType } from '../Card/Card'

const CARDS_PER_PAGE = 12

type PagesManagerProps = {
  cards: CardType[]
  setActiveCardIdx: (index: number) => void
}

const PaperCardScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: auto;
  @media print {
    overflow: visible;
  }
`

const PaperCardScrollInner = styled.div`
  padding: 5%;
  @media print {
    padding: 0;
  }
`

export const PagesManager = ({
  cards,
  setActiveCardIdx
}: PagesManagerProps) => {
  const numberOfPages = Math.ceil(cards.length / CARDS_PER_PAGE)
  const pages = Array.from(Array(numberOfPages).keys()).map(i => {
    return cards.slice(i*CARDS_PER_PAGE, (i+1)*CARDS_PER_PAGE)
  })
  return (
    <PaperCardScrollContainer>
      {pages.map((cardsOnPage, index) => {
        return (
          <div key={`page-set-${index}`}>
            <PaperCardScrollInner key={`front-page-${index}`}>
              <PaperCard
                offsetIndex={index * CARDS_PER_PAGE}
                cards={cardsOnPage}
                setActiveCard={setActiveCardIdx}
              />
            </PaperCardScrollInner>
            <PaperCardScrollInner key={`back-page-${index}`}>
              <PaperCard
                offsetIndex={index * CARDS_PER_PAGE}
                cards={cardsOnPage}
                setActiveCard={setActiveCardIdx}
                backs
              />
            </PaperCardScrollInner>
          </div>
        )
      })}
    </PaperCardScrollContainer>
  )
}