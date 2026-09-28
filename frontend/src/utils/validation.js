/**
 * Validation utilities for form data
 */

/**
 * Validate movie data according to backend schema requirements
 * @param {Object} data - Movie data to validate
 * @returns {Object} Object containing validation errors (empty if valid)
 */
export const validateMovie = (data) => {
  const errors = {}
  const currentYear = new Date().getFullYear()

  // Validate titulo (required, max 200 characters)
  if (!data.titulo || data.titulo.trim().length === 0) {
    errors.titulo = 'Title is required'
  } else if (data.titulo.length > 200) {
    errors.titulo = 'Title must be 200 characters or less'
  }

  // Validate productora (required, max 200 characters)
  if (!data.productora || data.productora.trim().length === 0) {
    errors.productora = 'Production company is required'
  } else if (data.productora.length > 200) {
    errors.productora = 'Production company must be 200 characters or less'
  }

  // Validate genero (required, max 100 characters)
  if (!data.genero || data.genero.trim().length === 0) {
    errors.genero = 'Genre is required'
  } else if (data.genero.length > 100) {
    errors.genero = 'Genre must be 100 characters or less'
  }

  // Validate plataforma (required, max 100 characters)
  if (!data.plataforma || data.plataforma.trim().length === 0) {
    errors.plataforma = 'Platform is required'
  } else if (data.plataforma.length > 100) {
    errors.plataforma = 'Platform must be 100 characters or less'
  }

  // Validate anio_lanzamiento (required, 1888 to current year + 5)
  if (!data.anio_lanzamiento && data.anio_lanzamiento !== 0) {
    errors.anio_lanzamiento = 'Release year is required'
  } else {
    const year = Number(data.anio_lanzamiento)
    if (isNaN(year) || !Number.isInteger(year)) {
      errors.anio_lanzamiento = 'Release year must be a valid number'
    } else if (year < 1888 || year > currentYear + 5) {
      errors.anio_lanzamiento = `Year must be between 1888 and ${currentYear + 5}`
    }
  }

  // Validate calificacion (optional, 0-10)
  if (data.calificacion !== null && data.calificacion !== undefined && data.calificacion !== '') {
    const rating = Number(data.calificacion)
    if (isNaN(rating)) {
      errors.calificacion = 'Rating must be a valid number'
    } else if (rating < 0 || rating > 10) {
      errors.calificacion = 'Rating must be between 0 and 10'
    }
  }

  // Validate director (required, max 200 characters)
  if (!data.director || data.director.trim().length === 0) {
    errors.director = 'Director is required'
  } else if (data.director.length > 200) {
    errors.director = 'Director must be 200 characters or less'
  }

  // Validate actores (optional, max 10 comma-separated actors)
  if (data.actores && data.actores.trim().length > 0) {
    const actorsList = data.actores.split(',').map(a => a.trim()).filter(a => a.length > 0)
    if (actorsList.length > 10) {
      errors.actores = 'Maximum 10 actors allowed'
    }
  }

  // Validate duracion_minutos (required, 1-1000)
  if (!data.duracion_minutos && data.duracion_minutos !== 0) {
    errors.duracion_minutos = 'Duration is required'
  } else {
    const duration = Number(data.duracion_minutos)
    if (isNaN(duration) || !Number.isInteger(duration)) {
      errors.duracion_minutos = 'Duration must be a valid number'
    } else if (duration < 1 || duration > 1000) {
      errors.duracion_minutos = 'Duration must be between 1 and 1000 minutes'
    }
  }

  // Validate clasificacion (required, max 10 characters)
  if (!data.clasificacion || data.clasificacion.trim().length === 0) {
    errors.clasificacion = 'Classification is required'
  } else if (data.clasificacion.length > 10) {
    errors.clasificacion = 'Classification must be 10 characters or less'
  }

  return errors
}

/**
 * Validate videogame data according to backend schema requirements
 * @param {Object} data - Videogame data to validate
 * @returns {Object} Object containing validation errors (empty if valid)
 */
export const validateVideogame = (data) => {
  const errors = {}
  const currentYear = new Date().getFullYear()

  // Validate titulo (required, max 200 characters)
  if (!data.titulo || data.titulo.trim().length === 0) {
    errors.titulo = 'Title is required'
  } else if (data.titulo.length > 200) {
    errors.titulo = 'Title must be 200 characters or less'
  }

  // Validate genero (required, max 100 characters)
  if (!data.genero || data.genero.trim().length === 0) {
    errors.genero = 'Genre is required'
  } else if (data.genero.length > 100) {
    errors.genero = 'Genre must be 100 characters or less'
  }

  // Validate plataforma (required, max 100 characters)
  if (!data.plataforma || data.plataforma.trim().length === 0) {
    errors.plataforma = 'Platform is required'
  } else if (data.plataforma.length > 100) {
    errors.plataforma = 'Platform must be 100 characters or less'
  }

  // Validate anio_lanzamiento (required, 1958 to current year + 5)
  if (!data.anio_lanzamiento && data.anio_lanzamiento !== 0) {
    errors.anio_lanzamiento = 'Release year is required'
  } else {
    const year = Number(data.anio_lanzamiento)
    if (isNaN(year) || !Number.isInteger(year)) {
      errors.anio_lanzamiento = 'Release year must be a valid number'
    } else if (year < 1958 || year > currentYear + 5) {
      errors.anio_lanzamiento = `Year must be between 1958 and ${currentYear + 5}`
    }
  }

  // Validate clasificacion (required, must be one of: E, E10+, T, M, AO, RP)
  const validClasificaciones = ['E', 'E10+', 'T', 'M', 'AO', 'RP']
  if (!data.clasificacion || data.clasificacion.trim().length === 0) {
    errors.clasificacion = 'Classification is required'
  } else if (!validClasificaciones.includes(data.clasificacion)) {
    errors.clasificacion = `Classification must be one of: ${validClasificaciones.join(', ')}`
  }

  // Validate desarrollador (required, max 200 characters)
  if (!data.desarrollador || data.desarrollador.trim().length === 0) {
    errors.desarrollador = 'Developer is required'
  } else if (data.desarrollador.length > 200) {
    errors.desarrollador = 'Developer must be 200 characters or less'
  }

  // Validate jugadores (optional, must match pattern: digit, digit-digit, or digit+)
  if (data.jugadores && data.jugadores.trim().length > 0) {
    const jugadoresPattern = /^\d+(-\d+)?(\+)?$/
    if (!jugadoresPattern.test(data.jugadores.trim())) {
      errors.jugadores = 'Players must be in format: "1", "1-4", or "1+"'
    } else if (data.jugadores.length > 50) {
      errors.jugadores = 'Players must be 50 characters or less'
    }
  }

  return errors
}
