import { describe, it, expect } from 'vitest'
import { validateMovie, validateVideogame } from './validation'

describe('validation', () => {
  describe('validateMovie', () => {
    const validMovie = {
      titulo: 'Test Movie',
      productora: 'Test Studio',
      genero: 'Action',
      plataforma: 'Netflix',
      anio_lanzamiento: 2024,
      calificacion: 8.5,
      director: 'John Doe',
      actores: 'Actor 1, Actor 2',
      duracion_minutos: 120,
      clasificacion: 'PG-13'
    }

    it('returns no errors for valid movie data', () => {
      const errors = validateMovie(validMovie)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    describe('titulo validation', () => {
      it('requires titulo', () => {
        const movie = { ...validMovie, titulo: '' }
        const errors = validateMovie(movie)
        expect(errors.titulo).toBe('Title is required')
      })

      it('requires titulo with non-whitespace content', () => {
        const movie = { ...validMovie, titulo: '   ' }
        const errors = validateMovie(movie)
        expect(errors.titulo).toBe('Title is required')
      })

      it('limits titulo to 200 characters', () => {
        const movie = { ...validMovie, titulo: 'a'.repeat(201) }
        const errors = validateMovie(movie)
        expect(errors.titulo).toBe('Title must be 200 characters or less')
      })
    })

    describe('productora validation', () => {
      it('requires productora', () => {
        const movie = { ...validMovie, productora: '' }
        const errors = validateMovie(movie)
        expect(errors.productora).toBe('Production company is required')
      })

      it('limits productora to 200 characters', () => {
        const movie = { ...validMovie, productora: 'a'.repeat(201) }
        const errors = validateMovie(movie)
        expect(errors.productora).toBe('Production company must be 200 characters or less')
      })
    })

    describe('genero validation', () => {
      it('requires genero', () => {
        const movie = { ...validMovie, genero: '' }
        const errors = validateMovie(movie)
        expect(errors.genero).toBe('Genre is required')
      })

      it('limits genero to 100 characters', () => {
        const movie = { ...validMovie, genero: 'a'.repeat(101) }
        const errors = validateMovie(movie)
        expect(errors.genero).toBe('Genre must be 100 characters or less')
      })
    })

    describe('plataforma validation', () => {
      it('requires plataforma', () => {
        const movie = { ...validMovie, plataforma: '' }
        const errors = validateMovie(movie)
        expect(errors.plataforma).toBe('Platform is required')
      })

      it('limits plataforma to 100 characters', () => {
        const movie = { ...validMovie, plataforma: 'a'.repeat(101) }
        const errors = validateMovie(movie)
        expect(errors.plataforma).toBe('Platform must be 100 characters or less')
      })
    })

    describe('anio_lanzamiento validation', () => {
      const currentYear = new Date().getFullYear()

      it('requires anio_lanzamiento', () => {
        const movie = { ...validMovie, anio_lanzamiento: null }
        const errors = validateMovie(movie)
        expect(errors.anio_lanzamiento).toBe('Release year is required')
      })

      it('rejects years before 1888', () => {
        const movie = { ...validMovie, anio_lanzamiento: 1887 }
        const errors = validateMovie(movie)
        expect(errors.anio_lanzamiento).toBe(`Year must be between 1888 and ${currentYear + 5}`)
      })

      it('rejects years more than 5 years in the future', () => {
        const movie = { ...validMovie, anio_lanzamiento: currentYear + 6 }
        const errors = validateMovie(movie)
        expect(errors.anio_lanzamiento).toBe(`Year must be between 1888 and ${currentYear + 5}`)
      })

      it('accepts year 1888', () => {
        const movie = { ...validMovie, anio_lanzamiento: 1888 }
        const errors = validateMovie(movie)
        expect(errors.anio_lanzamiento).toBeUndefined()
      })

      it('accepts current year plus 5', () => {
        const movie = { ...validMovie, anio_lanzamiento: currentYear + 5 }
        const errors = validateMovie(movie)
        expect(errors.anio_lanzamiento).toBeUndefined()
      })
    })

    describe('calificacion validation', () => {
      it('allows null calificacion', () => {
        const movie = { ...validMovie, calificacion: null }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBeUndefined()
      })

      it('allows empty string calificacion', () => {
        const movie = { ...validMovie, calificacion: '' }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBeUndefined()
      })

      it('rejects calificacion below 0', () => {
        const movie = { ...validMovie, calificacion: -0.1 }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBe('Rating must be between 0 and 10')
      })

      it('rejects calificacion above 10', () => {
        const movie = { ...validMovie, calificacion: 10.1 }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBe('Rating must be between 0 and 10')
      })

      it('accepts calificacion 0', () => {
        const movie = { ...validMovie, calificacion: 0 }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBeUndefined()
      })

      it('accepts calificacion 10', () => {
        const movie = { ...validMovie, calificacion: 10 }
        const errors = validateMovie(movie)
        expect(errors.calificacion).toBeUndefined()
      })
    })

    describe('director validation', () => {
      it('requires director', () => {
        const movie = { ...validMovie, director: '' }
        const errors = validateMovie(movie)
        expect(errors.director).toBe('Director is required')
      })

      it('limits director to 200 characters', () => {
        const movie = { ...validMovie, director: 'a'.repeat(201) }
        const errors = validateMovie(movie)
        expect(errors.director).toBe('Director must be 200 characters or less')
      })
    })

    describe('actores validation', () => {
      it('allows null actores', () => {
        const movie = { ...validMovie, actores: null }
        const errors = validateMovie(movie)
        expect(errors.actores).toBeUndefined()
      })

      it('allows empty string actores', () => {
        const movie = { ...validMovie, actores: '' }
        const errors = validateMovie(movie)
        expect(errors.actores).toBeUndefined()
      })

      it('accepts up to 10 actors', () => {
        const movie = { 
          ...validMovie, 
          actores: Array(10).fill('Actor').join(', ')
        }
        const errors = validateMovie(movie)
        expect(errors.actores).toBeUndefined()
      })

      it('rejects more than 10 actors', () => {
        const movie = { 
          ...validMovie, 
          actores: Array(11).fill('Actor').join(', ')
        }
        const errors = validateMovie(movie)
        expect(errors.actores).toBe('Maximum 10 actors allowed')
      })
    })

    describe('duracion_minutos validation', () => {
      it('requires duracion_minutos', () => {
        const movie = { ...validMovie, duracion_minutos: null }
        const errors = validateMovie(movie)
        expect(errors.duracion_minutos).toBe('Duration is required')
      })

      it('rejects duration below 1', () => {
        const movie = { ...validMovie, duracion_minutos: 0 }
        const errors = validateMovie(movie)
        expect(errors.duracion_minutos).toBe('Duration must be between 1 and 1000 minutes')
      })

      it('rejects duration above 1000', () => {
        const movie = { ...validMovie, duracion_minutos: 1001 }
        const errors = validateMovie(movie)
        expect(errors.duracion_minutos).toBe('Duration must be between 1 and 1000 minutes')
      })

      it('accepts duration 1', () => {
        const movie = { ...validMovie, duracion_minutos: 1 }
        const errors = validateMovie(movie)
        expect(errors.duracion_minutos).toBeUndefined()
      })

      it('accepts duration 1000', () => {
        const movie = { ...validMovie, duracion_minutos: 1000 }
        const errors = validateMovie(movie)
        expect(errors.duracion_minutos).toBeUndefined()
      })
    })

    describe('clasificacion validation', () => {
      it('requires clasificacion', () => {
        const movie = { ...validMovie, clasificacion: '' }
        const errors = validateMovie(movie)
        expect(errors.clasificacion).toBe('Classification is required')
      })

      it('limits clasificacion to 10 characters', () => {
        const movie = { ...validMovie, clasificacion: 'a'.repeat(11) }
        const errors = validateMovie(movie)
        expect(errors.clasificacion).toBe('Classification must be 10 characters or less')
      })
    })
  })

  describe('validateVideogame', () => {
    const validVideogame = {
      titulo: 'Test Game',
      genero: 'RPG',
      plataforma: 'PC',
      anio_lanzamiento: 2024,
      clasificacion: 'E',
      desarrollador: 'Test Studio',
      jugadores: '1-4'
    }

    it('returns no errors for valid videogame data', () => {
      const errors = validateVideogame(validVideogame)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    describe('titulo validation', () => {
      it('requires titulo', () => {
        const game = { ...validVideogame, titulo: '' }
        const errors = validateVideogame(game)
        expect(errors.titulo).toBe('Title is required')
      })

      it('limits titulo to 200 characters', () => {
        const game = { ...validVideogame, titulo: 'a'.repeat(201) }
        const errors = validateVideogame(game)
        expect(errors.titulo).toBe('Title must be 200 characters or less')
      })
    })

    describe('genero validation', () => {
      it('requires genero', () => {
        const game = { ...validVideogame, genero: '' }
        const errors = validateVideogame(game)
        expect(errors.genero).toBe('Genre is required')
      })

      it('limits genero to 100 characters', () => {
        const game = { ...validVideogame, genero: 'a'.repeat(101) }
        const errors = validateVideogame(game)
        expect(errors.genero).toBe('Genre must be 100 characters or less')
      })
    })

    describe('plataforma validation', () => {
      it('requires plataforma', () => {
        const game = { ...validVideogame, plataforma: '' }
        const errors = validateVideogame(game)
        expect(errors.plataforma).toBe('Platform is required')
      })

      it('limits plataforma to 100 characters', () => {
        const game = { ...validVideogame, plataforma: 'a'.repeat(101) }
        const errors = validateVideogame(game)
        expect(errors.plataforma).toBe('Platform must be 100 characters or less')
      })
    })

    describe('anio_lanzamiento validation', () => {
      const currentYear = new Date().getFullYear()

      it('requires anio_lanzamiento', () => {
        const game = { ...validVideogame, anio_lanzamiento: null }
        const errors = validateVideogame(game)
        expect(errors.anio_lanzamiento).toBe('Release year is required')
      })

      it('rejects years before 1958', () => {
        const game = { ...validVideogame, anio_lanzamiento: 1957 }
        const errors = validateVideogame(game)
        expect(errors.anio_lanzamiento).toBe(`Year must be between 1958 and ${currentYear + 5}`)
      })

      it('rejects years more than 5 years in the future', () => {
        const game = { ...validVideogame, anio_lanzamiento: currentYear + 6 }
        const errors = validateVideogame(game)
        expect(errors.anio_lanzamiento).toBe(`Year must be between 1958 and ${currentYear + 5}`)
      })

      it('accepts year 1958', () => {
        const game = { ...validVideogame, anio_lanzamiento: 1958 }
        const errors = validateVideogame(game)
        expect(errors.anio_lanzamiento).toBeUndefined()
      })

      it('accepts current year plus 5', () => {
        const game = { ...validVideogame, anio_lanzamiento: currentYear + 5 }
        const errors = validateVideogame(game)
        expect(errors.anio_lanzamiento).toBeUndefined()
      })
    })

    describe('clasificacion validation', () => {
      it('requires clasificacion', () => {
        const game = { ...validVideogame, clasificacion: '' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBe('Classification is required')
      })

      it('accepts E rating', () => {
        const game = { ...validVideogame, clasificacion: 'E' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('accepts E10+ rating', () => {
        const game = { ...validVideogame, clasificacion: 'E10+' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('accepts T rating', () => {
        const game = { ...validVideogame, clasificacion: 'T' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('accepts M rating', () => {
        const game = { ...validVideogame, clasificacion: 'M' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('accepts AO rating', () => {
        const game = { ...validVideogame, clasificacion: 'AO' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('accepts RP rating', () => {
        const game = { ...validVideogame, clasificacion: 'RP' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBeUndefined()
      })

      it('rejects invalid clasificacion', () => {
        const game = { ...validVideogame, clasificacion: 'INVALID' }
        const errors = validateVideogame(game)
        expect(errors.clasificacion).toBe('Classification must be one of: E, E10+, T, M, AO, RP')
      })
    })

    describe('desarrollador validation', () => {
      it('requires desarrollador', () => {
        const game = { ...validVideogame, desarrollador: '' }
        const errors = validateVideogame(game)
        expect(errors.desarrollador).toBe('Developer is required')
      })

      it('limits desarrollador to 200 characters', () => {
        const game = { ...validVideogame, desarrollador: 'a'.repeat(201) }
        const errors = validateVideogame(game)
        expect(errors.desarrollador).toBe('Developer must be 200 characters or less')
      })
    })

    describe('jugadores validation', () => {
      it('allows null jugadores', () => {
        const game = { ...validVideogame, jugadores: null }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('allows empty string jugadores', () => {
        const game = { ...validVideogame, jugadores: '' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('accepts single digit format', () => {
        const game = { ...validVideogame, jugadores: '1' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('accepts range format', () => {
        const game = { ...validVideogame, jugadores: '1-4' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('accepts plus format', () => {
        const game = { ...validVideogame, jugadores: '2+' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('accepts range with plus format', () => {
        const game = { ...validVideogame, jugadores: '1-8+' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBeUndefined()
      })

      it('rejects invalid format', () => {
        const game = { ...validVideogame, jugadores: 'invalid' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBe('Players must be in format: "1", "1-4", or "1+"')
      })

      it('rejects format with letters', () => {
        const game = { ...validVideogame, jugadores: '1-4 players' }
        const errors = validateVideogame(game)
        expect(errors.jugadores).toBe('Players must be in format: "1", "1-4", or "1+"')
      })
    })
  })
})
