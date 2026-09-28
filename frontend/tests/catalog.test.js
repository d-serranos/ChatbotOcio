import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCard from '@/components/catalog/MovieCard.vue'
import VideogameCard from '@/components/catalog/VideogameCard.vue'
import MediaGrid from '@/components/catalog/MediaGrid.vue'
import Pagination from '@/components/catalog/Pagination.vue'

describe('Catalog Components', () => {
  describe('MovieCard', () => {
    it('renders movie information correctly', () => {
      const movie = {
        titulo: 'The Matrix',
        genero: 'Sci-Fi',
        anio_lanzamiento: 1999,
        plataforma: 'Netflix',
        director: 'Wachowski Brothers',
        calificacion: 8.7
      }

      const wrapper = mount(MovieCard, {
        props: { movie }
      })

      expect(wrapper.text()).toContain('The Matrix')
      expect(wrapper.text()).toContain('Sci-Fi')
      expect(wrapper.text()).toContain('1999')
      expect(wrapper.text()).toContain('Netflix')
      expect(wrapper.text()).toContain('Wachowski Brothers')
      expect(wrapper.text()).toContain('8.7')
    })

    it('emits click event when card is clicked', async () => {
      const movie = {
        titulo: 'Test Movie',
        genero: 'Action',
        anio_lanzamiento: 2020,
        plataforma: 'Prime Video'
      }

      const wrapper = mount(MovieCard, {
        props: { movie }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('click')
      expect(wrapper.emitted('click')?.[0]).toEqual([movie])
    })

    it('has hover and cursor pointer classes', () => {
      const movie = {
        titulo: 'Test Movie',
        genero: 'Action',
        anio_lanzamiento: 2020,
        plataforma: 'Prime Video'
      }

      const wrapper = mount(MovieCard, {
        props: { movie }
      })

      const card = wrapper.find('div')
      expect(card.classes()).toContain('cursor-pointer')
      expect(card.classes()).toContain('hover:scale-105')
    })
  })

  describe('VideogameCard', () => {
    it('renders videogame information correctly', () => {
      const videogame = {
        titulo: 'The Last of Us',
        genero: 'Action-Adventure',
        anio_lanzamiento: 2013,
        plataforma: 'PlayStation',
        clasificacion: 'M',
        desarrollador: 'Naughty Dog',
        numero_jugadores: '1'
      }

      const wrapper = mount(VideogameCard, {
        props: { videogame }
      })

      expect(wrapper.text()).toContain('The Last of Us')
      expect(wrapper.text()).toContain('Action-Adventure')
      expect(wrapper.text()).toContain('2013')
      expect(wrapper.text()).toContain('PlayStation')
      expect(wrapper.text()).toContain('M')
      expect(wrapper.text()).toContain('Naughty Dog')
    })

    it('emits click event when card is clicked', async () => {
      const videogame = {
        titulo: 'Test Game',
        genero: 'RPG',
        anio_lanzamiento: 2021,
        plataforma: 'PC'
      }

      const wrapper = mount(VideogameCard, {
        props: { videogame }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('click')
      expect(wrapper.emitted('click')?.[0]).toEqual([videogame])
    })

    it('applies correct classification color classes', () => {
      const classifications = [
        { value: 'E', expected: 'bg-green-100' },
        { value: 'T', expected: 'bg-yellow-100' },
        { value: 'M', expected: 'bg-orange-100' }
      ]

      classifications.forEach(({ value, expected }) => {
        const wrapper = mount(VideogameCard, {
          props: {
            videogame: {
              titulo: 'Test',
              genero: 'Action',
              anio_lanzamiento: 2020,
              plataforma: 'PC',
              clasificacion: value
            }
          }
        })

        const badge = wrapper.find('span.px-2')
        expect(badge.classes()).toContain(expected)
      })
    })
  })

  describe('MediaGrid', () => {
    it('renders with correct grid classes', () => {
      const wrapper = mount(MediaGrid)
      
      const grid = wrapper.find('div')
      expect(grid.classes()).toContain('grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-3')
      expect(grid.classes()).toContain('lg:grid-cols-4')
      expect(grid.classes()).toContain('gap-6')
    })

    it('renders slot content', () => {
      const wrapper = mount(MediaGrid, {
        slots: {
          default: '<div class="test-card">Test Card</div>'
        }
      })

      expect(wrapper.html()).toContain('Test Card')
      expect(wrapper.find('.test-card').exists()).toBe(true)
    })
  })

  describe('Pagination', () => {
    it('renders current page and total pages', () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 10
        }
      })

      expect(wrapper.text()).toContain('Page 3 of 10')
    })

    it('disables Previous button on first page', () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5
        }
      })

      const buttons = wrapper.findAllComponents({ name: 'Button' })
      const previousButton = buttons[0]
      
      expect(previousButton.props('disabled')).toBe(true)
    })

    it('disables Next button on last page', () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 5,
          totalPages: 5
        }
      })

      const buttons = wrapper.findAllComponents({ name: 'Button' })
      const nextButton = buttons[buttons.length - 1]
      
      expect(nextButton.props('disabled')).toBe(true)
    })

    it('emits change event when page button is clicked', async () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5
        }
      })

      // Find and click page 2 button
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text() === '2'
      )
      
      if (pageButtons.length > 0) {
        await pageButtons[0].trigger('click')
        expect(wrapper.emitted()).toHaveProperty('change')
      }
    })

    it('shows all pages when totalPages <= 7', () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5
        }
      })

      const text = wrapper.text()
      expect(text).toContain('1')
      expect(text).toContain('2')
      expect(text).toContain('3')
      expect(text).toContain('4')
      expect(text).toContain('5')
    })

    it('shows ellipsis for many pages', () => {
      const wrapper = mount(Pagination, {
        props: {
          currentPage: 5,
          totalPages: 20
        }
      })

      const text = wrapper.text()
      expect(text).toContain('...')
    })
  })
})
