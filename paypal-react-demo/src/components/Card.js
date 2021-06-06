import React from 'react'
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardDeck,
  CardSubtitle,
  CardBody,
} from 'reactstrap'
//import ScandDiagram from '/ScandDiagram.jpg'

export default function CardTemplate() {
  return (
    <CardDeck>
      <Card>
        <CardImg top width="20%" src="/ScandDiagram.jpg" alt="Card image cap" />
        <i class="fas fa-coins"></i>
        <CardBody>
          <CardTitle tag="h5">ETHEREUM</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Buy (5) Coins
          </CardSubtitle>
          <CardText>This is a wider card </CardText>
          <Button>Button</Button>
        </CardBody>
      </Card>
    </CardDeck>
  )
}
