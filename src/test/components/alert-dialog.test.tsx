import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AlertDialog from '@wikinime/components/alert-dialog'

describe('AlertDialog', () => {
  let title: string
  let description: string
  let cancelButton: string
  let actionButton: string

  beforeEach(() => {
    title = 'Alert dialog title'
    description = 'Alert dialog description'
    cancelButton = 'Cancel'
    actionButton = 'Yes'
  })

  test('Should render title, description, and buttons', () => {
    render(<AlertDialog open title={title} description={description} />)

    expect(screen.getByText(title)).toBeVisible()
    expect(screen.getByText(description)).toBeVisible()
    expect(screen.getByText(cancelButton)).toBeVisible()
    expect(screen.getByText(actionButton)).toBeVisible()
  })

  test('Should not render title, description, and buttons', () => {
    render(<AlertDialog open />)

    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.queryByText(description)).not.toBeInTheDocument()
  })
})
